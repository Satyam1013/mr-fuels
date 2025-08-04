/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Model, Types } from "mongoose";
import { PumpExpenseDocument } from "../pump-expenses/pump-expenses.schema";

interface PumpExpenseStats {
  pumpExpenseTotalAmount: number;
}

export async function getPumpExpenseStats(
  model: Model<PumpExpenseDocument>,
  pumpId: string,
  startDate: Date,
  endDate: Date,
): Promise<PumpExpenseStats> {
  const pumpExpenseData = await model.aggregate([
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

  const pumpExpenseTotalAmount = pumpExpenseData.reduce(
    (sum, item) => sum + (item.categoryAmount ?? 0),
    0,
  );

  return { pumpExpenseTotalAmount };
}
