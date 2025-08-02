"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreditorStats = getCreditorStats;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const mongoose_1 = require("mongoose");
async function getCreditorStats(model, pumpId, startDate, endDate) {
    const stats = await model.aggregate([
        {
            $match: {
                pumpId: new mongoose_1.Types.ObjectId(pumpId),
                "records.time": { $gte: startDate, $lte: endDate },
            },
        },
        { $unwind: "$records" },
        {
            $match: {
                "records.time": { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: "$records.type", // credit or return
                totalAmount: { $sum: "$records.amount" },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                type: "$_id",
                totalAmount: 1,
                count: 1,
                _id: 0,
            },
        },
    ]);
    const creditorTotalAmount = stats.reduce((sum, entry) => sum + entry.totalAmount, 0);
    return { breakdown: stats, creditorTotalAmount };
}
