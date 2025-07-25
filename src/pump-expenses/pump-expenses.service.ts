/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PumpExpense, PumpExpenseDocument } from "./pump-expenses.schema";
import {
  CreatePumpExpenseDto,
  UpdatePumpExpenseDto,
} from "./pump-expenses.dto";
import { uploadPdfBufferToCloudinary } from "../utils/cloudinary";
import dayjs from "dayjs";

@Injectable()
export class PumpExpenseService {
  constructor(
    @InjectModel(PumpExpense.name)
    private readonly pumpExpenseModel: Model<PumpExpenseDocument>,
  ) {}

  async create(dto: CreatePumpExpenseDto, images: Express.Multer.File[]) {
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
      date: dto.date,
      entries: dto.entries,
    });
  }

  async findAll(dateString?: string) {
    if (dateString) {
      const date = dayjs(dateString);
      const startOfDay = date.startOf("day").toDate();
      const endOfDay = date.endOf("day").toDate();

      const data = await this.pumpExpenseModel.aggregate([
        {
          $match: {
            date: { $gte: startOfDay, $lte: endOfDay },
          },
        },
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
      ]);

      return data;
    }

    // No date provided — return all grouped by date
    const allData = await this.pumpExpenseModel.aggregate([
      {
        $sort: { date: -1 },
      },
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
        $sort: { date: -1 },
      },
    ]);

    return allData;
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
