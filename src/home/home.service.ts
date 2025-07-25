/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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

  async getAll(filterType: FilterType, baseDate: string) {
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

    // Existing aggregation
    const pumpExpenseData = await this.pumpExpenseModel.aggregate([
      {
        $match: {
          date: { $gte: startDate, $lte: endDate },
        },
      },
      { $unwind: "$entries" },
      {
        $group: {
          _id: "$entries.title",
          categoryAmount: { $sum: "$entries.amount" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          title: "$_id",
          categoryAmount: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    const totalAmount = pumpExpenseData.reduce(
      (sum, item) => sum + (item.categoryAmount ?? 0),
      0,
    );

    return [
      {
        filterType,
        categories: [
          {
            id: 1,
            name: "Pump Expenses",
            amount: totalAmount,
            date: startDate,
          },
          {
            id: 2,
            name: "Creditors",
            amount: totalAmount,
            date: startDate,
          },
          {
            id: 3,
            name: "Personal Expenses",
            amount: totalAmount,
            date: startDate,
          },
          {
            id: 4,
            name: "UPI Payment",
            amount: totalAmount,
            date: startDate,
          },
          {
            id: 5,
            name: "Swipe Collection",
            amount: totalAmount,
            date: startDate,
          },
          {
            id: 6,
            name: "UPI Payment",
            amount: totalAmount,
            date: startDate,
          },
        ],
        sale: {
          ltr: 20000,
          amount: 10000,
        },
        collection: {
          ltr: 20000,
          amount: 10000,
        },
        collected: {
          ltr: 20000,
          amount: 10000,
        },
        deposited: {
          ltr: 20000,
          amount: 10000,
        },
        diff: {
          ltr: 0,
          amount: 0,
        },
        salesTarget: 25000,
        saleLastMonth: 20000,
        expensesLastMonth: 20,
      },
    ];
  }
}
