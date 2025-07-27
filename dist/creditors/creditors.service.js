"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreditorService = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const creditors_schema_1 = require("./creditors.schema");
const date_1 = require("../utils/date");
const creditor_contact_schema_1 = require("../creditor-contact/creditor-contact.schema");
let CreditorService = class CreditorService {
    constructor(creditorModel, creditorContactModel) {
        this.creditorModel = creditorModel;
        this.creditorContactModel = creditorContactModel;
    }
    computeTotals(records) {
        const totalCreditGiven = records
            .filter((r) => r.type === "credit")
            .reduce((sum, r) => sum + r.amount, 0);
        const totalReturned = records
            .filter((r) => r.type === "return")
            .reduce((sum, r) => sum + r.amount, 0);
        const totalCreditLeft = totalCreditGiven - totalReturned;
        const date = records?.length > 0
            ? new Date(Math.max(...records.map((r) => new Date(r.time).getTime())))
            : new Date();
        return { totalCreditGiven, totalCreditLeft, date };
    }
    async create(dto) {
        const creditorContact = await this.creditorContactModel.findById(dto.creditorContactId);
        if (!creditorContact) {
            throw new common_1.NotFoundException("Creditor contact not found");
        }
        const creditorObjectId = new mongoose_2.Types.ObjectId(dto.creditorContactId);
        const existing = await this.creditorModel.findOne({
            creditorContactId: creditorObjectId,
        });
        const normalizedRecords = dto.records.map((record) => ({
            ...record,
            time: new Date(record.time),
        }));
        const { totalCreditGiven, totalCreditLeft } = this.computeTotals(normalizedRecords);
        if (existing) {
            existing.records.push(...normalizedRecords);
            existing.totalCreditGiven += totalCreditGiven;
            existing.totalCreditLeft += totalCreditLeft;
            return await existing.save();
        }
        else {
            return await this.creditorModel.create({
                creditorContactId: creditorObjectId,
                records: normalizedRecords,
                totalCreditGiven,
                totalCreditLeft,
            });
        }
    }
    async findAll(dateString, filterType) {
        let startDate;
        let endDate;
        if (dateString && filterType) {
            ({ startDate, endDate } = (0, date_1.getDateRange)(filterType, dateString));
        }
        const pipeline = [
            { $unwind: "$records" },
            // Filter by record time
            ...(startDate && endDate
                ? [
                    {
                        $match: {
                            "records.time": {
                                $gte: startDate,
                                $lte: endDate,
                            },
                        },
                    },
                ]
                : []),
            // Join with creditor contacts
            {
                $lookup: {
                    from: "creditorcontacts",
                    localField: "creditorContactId",
                    foreignField: "_id",
                    as: "contact",
                },
            },
            { $unwind: "$contact" },
            // Project required fields
            {
                $project: {
                    creditorId: "$_id",
                    name: "$contact.name",
                    number: "$contact.number",
                    amount: "$records.amount",
                    time: "$records.time",
                    type: "$records.type",
                    paidType: "$records.paidType",
                    imgUrl: "$records.imgUrl",
                    details: "$records.details",
                    dateOnly: {
                        $dateToString: { format: "%Y-%m-%d", date: "$records.time" },
                    },
                },
            },
            // Group by date and push only records (no totals)
            {
                $group: {
                    _id: "$dateOnly",
                    records: {
                        $push: {
                            creditorId: "$creditorId",
                            name: "$name",
                            number: "$number",
                            amount: "$amount",
                            time: "$time",
                            type: "$type",
                            paidType: "$paidType",
                            details: "$details",
                            imgUrl: "$imgUrl",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    records: 1,
                },
            },
        ];
        return this.creditorModel.aggregate(pipeline);
    }
    async getCreditSummary(dateString, filterType) {
        const { startDate, endDate } = (0, date_1.getDateRange)(filterType, dateString);
        const pipeline = [
            { $unwind: "$records" },
            {
                $match: {
                    "records.time": {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalCreditGiven: {
                        $sum: {
                            $cond: [
                                { $eq: ["$records.type", "credit"] },
                                "$records.amount",
                                0,
                            ],
                        },
                    },
                    totalCreditReturned: {
                        $sum: {
                            $cond: [
                                { $eq: ["$records.type", "return"] },
                                "$records.amount",
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    totalCreditGiven: 1,
                    totalCreditLeft: {
                        $subtract: ["$totalCreditGiven", "$totalCreditReturned"],
                    },
                },
            },
        ];
        const [result] = await this.creditorModel.aggregate(pipeline);
        return result || { totalCreditGiven: 0, totalCreditLeft: 0 };
    }
    async findById(id) {
        const creditor = await this.creditorModel.findById(id);
        if (!creditor)
            throw new common_1.NotFoundException("Creditor not found");
        return creditor;
    }
    async update(id, dto) {
        const normalizedRecords = dto.records.map((record) => ({
            ...record,
            time: new Date(record.time),
        }));
        const { totalCreditGiven, totalCreditLeft, date } = this.computeTotals(normalizedRecords);
        const updated = await this.creditorModel.findByIdAndUpdate(id, {
            ...dto,
            records: normalizedRecords,
            totalCreditGiven,
            totalCreditLeft,
            date,
        }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException("Creditor not found");
        return updated;
    }
    async delete(id) {
        const deleted = await this.creditorModel.findByIdAndDelete(id);
        if (!deleted)
            throw new common_1.NotFoundException("Creditor not found");
        return { message: "Deleted successfully" };
    }
};
exports.CreditorService = CreditorService;
exports.CreditorService = CreditorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(creditors_schema_1.Creditor.name)),
    __param(1, (0, mongoose_1.InjectModel)(creditor_contact_schema_1.CreditorContact.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CreditorService);
