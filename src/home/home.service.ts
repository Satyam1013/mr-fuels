import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
  PumpExpense,
  PumpExpenseDocument,
} from "../pump-expenses/pump-expenses.schema";
import { FilterType } from "./home.dto";
import { getDateRange } from "../utils/date";
import { getPumpExpenseStats } from "../utils/pump-expense";

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(PumpExpense.name)
    private readonly pumpExpenseModel: Model<PumpExpenseDocument>,
  ) {}

  async getAll(filterType: FilterType, baseDate: string) {
    const { startDate, endDate } = getDateRange(filterType, baseDate);

    const { pumpExpenseTotalAmount } = await getPumpExpenseStats(
      this.pumpExpenseModel,
      startDate,
      endDate,
    );

    return [
      {
        filterType,
        categories: [
          {
            id: 1,
            name: "Pump Expenses",
            amount: pumpExpenseTotalAmount,
          },
          {
            id: 2,
            name: "Creditors",
            amount: pumpExpenseTotalAmount,
          },
          {
            id: 3,
            name: "Personal Expenses",
            amount: pumpExpenseTotalAmount,
          },
          {
            id: 4,
            name: "UPI Payment",
            amount: pumpExpenseTotalAmount,
          },
          {
            id: 5,
            name: "Swipe Collection",
            amount: pumpExpenseTotalAmount,
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
