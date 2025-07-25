/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  PumpExpense,
  PumpExpenseDocument,
} from "../pump-expenses/pump-expenses.schema";
import { FilterType } from "./home.dto";
import dayjs from "dayjs";

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(PumpExpense.name)
    private readonly pumpExpenseModel: Model<PumpExpenseDocument>,
  ) {}

  async getPumpExpenseByFilter(filterType: FilterType, baseDate: string) {
    const date = dayjs(baseDate);

    let startDate: Date;
    let endDate: Date;

    if (filterType === FilterType.DAILY) {
      startDate = date.startOf("day").toDate();
      endDate = date.endOf("day").toDate();
    } else if (filterType === FilterType.WEEKLY) {
      startDate = date.startOf("week").toDate();
      endDate = date.endOf("week").toDate();
    } else {
      startDate = date.startOf("month").toDate();
      endDate = date.endOf("month").toDate();
    }

    const data = await this.pumpExpenseModel.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      { $unwind: "$entries" },
      {
        $group: {
          _id: "$entries.category",
          categoryAmount: { $sum: "$entries.amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: "$_id",
          categoryAmount: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    const totalAmount = data.reduce(
      (sum, item) => sum + (item.categoryAmount ?? 0),
      0,
    );

    return {
      filterType,
      range: { startDate, endDate },
      totalAmount,
      categories: data,
    };
  }
}
