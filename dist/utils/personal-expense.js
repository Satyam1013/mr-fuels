"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonalExpenseStats = getPersonalExpenseStats;
const mongoose_1 = require("mongoose");
async function getPersonalExpenseStats(model, pumpId, startDate, endDate) {
    const personalExpenseData = await model.aggregate([
        {
            $match: {
                pumpId: new mongoose_1.Types.ObjectId(pumpId),
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
    const personalExpenseTotalAmount = personalExpenseData.reduce((sum, item) => sum + (item.categoryAmount ?? 0), 0);
    return { personalExpenseTotalAmount };
}
