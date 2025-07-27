/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, PipelineStage, Types } from "mongoose";
import { Creditor, CreditorDocument } from "./creditors.schema";
import {
  CreateCreditorDto,
  NormalizedCreditRecord,
  UpdateCreditorDto,
} from "./creditors.dto";
import { FilterType } from "../home/home.dto";
import { getDateRange } from "../utils/date";
import {
  CreditorContact,
  CreditorContactDocument,
} from "../creditor-contact/creditor-contact.schema";

@Injectable()
export class CreditorService {
  constructor(
    @InjectModel(Creditor.name)
    private readonly creditorModel: Model<CreditorDocument>,

    @InjectModel(CreditorContact.name)
    private readonly creditorContactModel: Model<CreditorContactDocument>,
  ) {}

  private computeTotals(records: NormalizedCreditRecord[]) {
    const totalCreditGiven = records
      .filter((r) => r.type === "credit")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalReturned = records
      .filter((r) => r.type === "return")
      .reduce((sum, r) => sum + r.amount, 0);

    const totalCreditLeft = totalCreditGiven - totalReturned;

    const date =
      records?.length > 0
        ? new Date(Math.max(...records.map((r) => new Date(r.time).getTime())))
        : new Date();

    return { totalCreditGiven, totalCreditLeft, date };
  }

  async create(dto: CreateCreditorDto) {
    const creditorContact = await this.creditorContactModel.findById(
      dto.creditorContactId,
    );
    if (!creditorContact) {
      throw new NotFoundException("Creditor contact not found");
    }

    const creditorObjectId = new Types.ObjectId(dto.creditorContactId);
    const existing = await this.creditorModel.findOne({
      creditorContactId: creditorObjectId,
    });

    const normalizedRecords: NormalizedCreditRecord[] = dto.records.map(
      (record) => ({
        ...record,
        time: new Date(record.time),
      }),
    );

    const { totalCreditGiven, totalCreditLeft } =
      this.computeTotals(normalizedRecords);

    if (existing) {
      existing.records.push(...normalizedRecords);
      existing.totalCreditGiven += totalCreditGiven;
      existing.totalCreditLeft += totalCreditLeft;
      return await existing.save();
    } else {
      return await this.creditorModel.create({
        creditorContactId: creditorObjectId,
        records: normalizedRecords,
        totalCreditGiven,
        totalCreditLeft,
      });
    }
  }

  async findAll(dateString?: string, filterType?: FilterType) {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (dateString && filterType) {
      ({ startDate, endDate } = getDateRange(filterType, dateString));
    }

    const pipeline: PipelineStage[] = [
      { $unwind: "$records" },

      // Filter by record time
      ...(startDate && endDate
        ? [
            {
              $match: {
                "records.time": {
                  $gte: startDate,
                  $lte: endDate,
                },
              },
            },
          ]
        : []),

      // Join with creditor contacts
      {
        $lookup: {
          from: "creditorcontacts",
          localField: "creditorContactId",
          foreignField: "_id",
          as: "contact",
        },
      },
      { $unwind: "$contact" },

      // Project required fields
      {
        $project: {
          creditorId: "$_id",
          name: "$contact.name",
          number: "$contact.number",
          amount: "$records.amount",
          time: "$records.time",
          type: "$records.type",
          paidType: "$records.paidType",
          imgUrl: "$records.imgUrl",
          details: "$records.details",
          dateOnly: {
            $dateToString: { format: "%Y-%m-%d", date: "$records.time" },
          },
        },
      },

      // Group by date and push only records (no totals)
      {
        $group: {
          _id: "$dateOnly",
          records: {
            $push: {
              creditorId: "$creditorId",
              name: "$name",
              number: "$number",
              amount: "$amount",
              time: "$time",
              type: "$type",
              paidType: "$paidType",
              details: "$details",
              imgUrl: "$imgUrl",
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          records: 1,
        },
      },
    ];

    return this.creditorModel.aggregate(pipeline);
  }

  async getCreditSummary(dateString: string, filterType: FilterType) {
    const { startDate, endDate } = getDateRange(filterType, dateString);

    const pipeline: PipelineStage[] = [
      { $unwind: "$records" },
      {
        $match: {
          "records.time": {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalCreditGiven: {
            $sum: {
              $cond: [
                { $eq: ["$records.type", "credit"] },
                "$records.amount",
                0,
              ],
            },
          },
          totalCreditReturned: {
            $sum: {
              $cond: [
                { $eq: ["$records.type", "return"] },
                "$records.amount",
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalCreditGiven: 1,
          totalCreditLeft: {
            $subtract: ["$totalCreditGiven", "$totalCreditReturned"],
          },
        },
      },
    ];

    const [result] = await this.creditorModel.aggregate(pipeline);
    return result || { totalCreditGiven: 0, totalCreditLeft: 0 };
  }

  async findById(id: string) {
    const creditor = await this.creditorModel.findById(id);
    if (!creditor) throw new NotFoundException("Creditor not found");
    return creditor;
  }

  async update(id: string, dto: UpdateCreditorDto) {
    const normalizedRecords = dto.records.map((record) => ({
      ...record,
      time: new Date(record.time),
    }));

    const { totalCreditGiven, totalCreditLeft, date } =
      this.computeTotals(normalizedRecords);

    const updated = await this.creditorModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        records: normalizedRecords,
        totalCreditGiven,
        totalCreditLeft,
        date,
      },
      { new: true },
    );

    if (!updated) throw new NotFoundException("Creditor not found");
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.creditorModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException("Creditor not found");
    return { message: "Deleted successfully" };
  }
}
