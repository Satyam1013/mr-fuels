import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Creditor, CreditorDocument } from "./creditors.schema";
import { CreateCreditorDto, UpdateCreditorDto } from "./creditors.dto";
import { FilterType } from "../home/home.dto";
import { getDateRange } from "../utils/date";

@Injectable()
export class CreditorService {
  constructor(
    @InjectModel(Creditor.name)
    private readonly creditorModel: Model<CreditorDocument>,
  ) {}

  private computeTotals(records: CreateCreditorDto["records"]) {
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
    const existing = await this.creditorModel.findOne({
      creditorContactId: dto.creditorContactId,
    });

    let totalCreditGiven = 0;
    let totalCreditLeft = 0;

    // Convert string dates to Date objects and calculate totals
    const normalizedRecords = dto.records.map((record) => {
      if (record.type === "credit") {
        totalCreditGiven += record.amount;
        totalCreditLeft += record.amount;
      } else if (record.type === "return") {
        totalCreditLeft -= record.amount;
      }

      return {
        ...record,
        time: new Date(record.time),
      };
    });

    if (existing) {
      existing.records.push(...normalizedRecords);
      existing.totalCreditGiven += totalCreditGiven;
      existing.totalCreditLeft += totalCreditLeft;
      existing.date = new Date();
      return await existing.save();
    } else {
      return await this.creditorModel.create({
        creditorContactId: new Types.ObjectId(dto.creditorContactId),
        records: normalizedRecords,
        totalCreditGiven,
        totalCreditLeft,
        date: new Date(),
      });
    }
  }

  async findAll(dateString?: string, filterType?: FilterType) {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (dateString && filterType) {
      ({ startDate, endDate } = getDateRange(filterType, dateString));
    }

    const matchStage =
      startDate && endDate
        ? [{ $match: { "records.time": { $gte: startDate, $lte: endDate } } }]
        : [];

    const aggregationPipeline = [
      ...matchStage,
      { $unwind: "$records" },
      {
        $match:
          startDate && endDate
            ? { "records.time": { $gte: startDate, $lte: endDate } }
            : {},
      },
      {
        $group: {
          _id: "$_id",
          date: { $first: "$date" },
          totalCreditGiven: { $first: "$totalCreditGiven" },
          totalCreditLeft: { $first: "$totalCreditLeft" },
          records: { $push: "$records" },
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          date: 1,
          totalCreditGiven: 1,
          totalCreditLeft: 1,
          records: 1,
        },
      },
      { $sort: { date: -1 } as const },
    ];

    return this.creditorModel.aggregate(aggregationPipeline);
  }

  async findById(id: string) {
    const creditor = await this.creditorModel.findById(id);
    if (!creditor) throw new NotFoundException("Creditor not found");
    return creditor;
  }

  async update(id: string, dto: UpdateCreditorDto) {
    const { totalCreditGiven, totalCreditLeft, date } = this.computeTotals(
      dto.records,
    );

    const updated = await this.creditorModel.findByIdAndUpdate(
      id,
      { ...dto, totalCreditGiven, totalCreditLeft, date },
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
