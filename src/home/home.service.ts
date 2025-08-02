/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { Creditor, CreditorDocument } from "../creditors/creditors.schema";
import { getCreditorStats } from "../utils/creditors";
import {
  PersonalExpense,
  PersonalExpenseDocument,
} from "../personal-expenses/personal-expenses.schema";
import { getPersonalExpenseStats } from "../utils/personal-expense";

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(PumpExpense.name)
    private readonly pumpExpenseModel: Model<PumpExpenseDocument>,
    @InjectModel(PersonalExpense.name)
    private readonly personalExpenseModel: Model<PersonalExpenseDocument>,
    @InjectModel(Creditor.name)
    private readonly creditorModel: Model<CreditorDocument>,
  ) {}

  async getAll(pumpId: string, filterType: FilterType, baseDate: string) {
    const { startDate, endDate } = getDateRange(filterType, baseDate);

    const { pumpExpenseTotalAmount } = await getPumpExpenseStats(
      this.pumpExpenseModel,
      pumpId,
      startDate,
      endDate,
    );

    const { creditorTotalAmount } = await getCreditorStats(
      this.creditorModel,
      pumpId,
      startDate,
      endDate,
    );

    const { personalExpenseTotalAmount } = await getPersonalExpenseStats(
      this.personalExpenseModel,
      pumpId,
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
            amount: creditorTotalAmount,
          },
          {
            id: 3,
            name: "Personal Expenses",
            amount: personalExpenseTotalAmount,
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
