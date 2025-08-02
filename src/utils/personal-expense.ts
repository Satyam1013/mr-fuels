/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Model, Types } from "mongoose";
import { PersonalExpenseDocument } from "../personal-expenses/personal-expenses.schema";

interface PersonalExpenseStats {
  breakdown: Array<{
    title: string;
    categoryAmount: number;
    count: number;
  }>;
  personalExpenseTotalAmount: number;
}

export async function getPersonalExpenseStats(
  model: Model<PersonalExpenseDocument>,
  pumpId: string,
  startDate: Date,
  endDate: Date,
): Promise<PersonalExpenseStats> {
  const personalExpenseData = await model.aggregate([
    {
      $match: {
        pumpId: new Types.ObjectId(pumpId),
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

  const personalExpenseTotalAmount = personalExpenseData.reduce(
    (sum, item) => sum + (item.categoryAmount ?? 0),
    0,
  );

  return { breakdown: personalExpenseData, personalExpenseTotalAmount };
}
