/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PumpExpense, PumpExpenseDocument } from "./pump-expenses.schema";
import {
  CreatePumpExpenseDto,
  UpdatePumpExpenseDto,
} from "./pump-expenses.dto";
import { uploadPdfBufferToCloudinary } from "../utils/cloudinary";
import { FilterType } from "../home/home.dto";
import { getDateRange } from "../utils/date";

@Injectable()
export class PumpExpenseService {
  constructor(
    @InjectModel(PumpExpense.name)
    private readonly pumpExpenseModel: Model<PumpExpenseDocument>,
  ) {}

  async create(
    dto: CreatePumpExpenseDto,
    images: Express.Multer.File[],
    pumpId: string,
  ) {
    if (images?.length) {
      for (let i = 0; i < dto.entries.length; i++) {
        if (images[i]) {
          const upload = await uploadPdfBufferToCloudinary(
            images[i].buffer,
            images[i].originalname,
          );
          dto.entries[i].imageUrl = upload.secure_url;
        }
      }
    }

    return this.pumpExpenseModel.create({
      pumpId: new Types.ObjectId(pumpId),
      date: dto.date,
      entries: dto.entries,
    });
  }

  async findAll(pumpId: string, dateString?: string, filterType?: FilterType) {
    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (dateString && filterType) {
      ({ startDate, endDate } = getDateRange(filterType, dateString));
    }

    const matchStage: any[] = [
      { $match: { pumpId: new Types.ObjectId(pumpId) } },
    ];

    if (startDate && endDate) {
      matchStage.push({
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      });
    }

    const aggregationPipeline = [
      ...matchStage,
      {
        $project: {
          _id: 0,
          date: 1,
          entries: 1,
        },
      },
      {
        $group: {
          _id: "$date",
          entries: { $push: "$entries" },
        },
      },
      {
        $project: {
          date: "$_id",
          entries: {
            $reduce: {
              input: "$entries",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
          _id: 0,
        },
      },
      {
        $sort: { date: -1 as const },
      },
    ];

    return this.pumpExpenseModel.aggregate(aggregationPipeline);
  }

  async findById(id: string) {
    const doc = await this.pumpExpenseModel.findById(id);
    if (!doc) throw new NotFoundException("Expense not found");
    return doc;
  }

  async update(id: string, dto: UpdatePumpExpenseDto) {
    const updated = await this.pumpExpenseModel.findByIdAndUpdate(
      id,
      { $set: { entries: dto.entries } },
      { new: true },
    );
    if (!updated) throw new NotFoundException("Expense not found");
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.pumpExpenseModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException("Expense not found");
    return { message: "Expense deleted successfully" };
  }
}
