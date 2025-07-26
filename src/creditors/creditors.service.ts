import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
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

  async create(dto: CreateCreditorDto) {
    try {
      return await this.creditorModel.create(dto);
    } catch (err) {
      if (err instanceof Error) {
        throw new InternalServerErrorException("Creation failed", err.message);
      }
      throw new InternalServerErrorException("Creation failed");
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
    const updated = await this.creditorModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException("Creditor not found");
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.creditorModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException("Creditor not found");
    return { message: "Deleted successfully" };
  }
}
