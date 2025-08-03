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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
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
const dayjs_1 = __importDefault(require("dayjs"));
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
    async create(dto, pumpId) {
        const creditorContact = await this.creditorContactModel.findById(dto.creditorContactId);
        if (!creditorContact) {
            throw new common_1.NotFoundException("Creditor contact not found");
        }
        const creditorObjectId = new mongoose_2.Types.ObjectId(dto.creditorContactId);
        const existing = await this.creditorModel.findOne({
            creditorContactId: creditorObjectId,
            pumpId: new mongoose_2.Types.ObjectId(pumpId),
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
                pumpId: new mongoose_2.Types.ObjectId(pumpId),
                records: normalizedRecords,
                totalCreditGiven,
                totalCreditLeft,
            });
        }
    }
    async findAll(pumpId, dateString, filterType) {
        let startDate;
        let endDate;
        if (dateString && filterType) {
            ({ startDate, endDate } = (0, date_1.getDateRange)(filterType, dateString));
        }
        const pipeline = [
            {
                $match: {
                    pumpId: new mongoose_2.Types.ObjectId(pumpId),
                },
            },
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
                    creditorContactId: "$creditorContactId",
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
                            creditorContactId: "$creditorContactId",
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
    async getCreditSummary(pumpId, dateString, filterType) {
        const { startDate, endDate } = (0, date_1.getDateRange)(filterType, dateString);
        const pipeline = [
            {
                $match: {
                    pumpId: new mongoose_2.Types.ObjectId(pumpId),
                },
            },
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
    async findById(contactId, pumpId, dateString, filterType) {
        let startDate;
        let endDate;
        if (dateString && filterType) {
            ({ startDate, endDate } = (0, date_1.getDateRange)(filterType, dateString));
        }
        const pipeline = [
            {
                $match: {
                    creditorContactId: new mongoose_2.Types.ObjectId(contactId),
                    pumpId: new mongoose_2.Types.ObjectId(pumpId),
                },
            },
            { $unwind: "$records" },
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
            {
                $lookup: {
                    from: "creditorcontacts",
                    localField: "creditorContactId",
                    foreignField: "_id",
                    as: "contact",
                },
            },
            { $unwind: "$contact" },
            {
                $project: {
                    creditorId: "$_id",
                    creditorContactId: "$creditorContactId",
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
            {
                $group: {
                    _id: "$dateOnly",
                    records: {
                        $push: {
                            creditorId: "$creditorId",
                            creditorContactId: "$creditorContactId",
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
                    date: "$_id",
                    records: 1,
                },
            },
            {
                $sort: { date: -1 },
            },
        ];
        const result = await this.creditorModel.aggregate(pipeline);
        if (!result.length) {
            return [
                {
                    date: (0, dayjs_1.default)(dateString).format("YYYY-MM-DD"),
                    records: [],
                },
            ];
        }
        return result;
    }
    async update(id, dto, pumpId) {
        const normalizedRecords = dto.records.map((record) => ({
            ...record,
            time: new Date(record.time),
        }));
        const { totalCreditGiven, totalCreditLeft, date } = this.computeTotals(normalizedRecords);
        const updated = await this.creditorModel.findOneAndUpdate({ _id: id, pumpId: new mongoose_2.Types.ObjectId(pumpId) }, {
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
    async delete(id, pumpId) {
        const deleted = await this.creditorModel.findOneAndDelete({
            _id: id,
            pumpId: new mongoose_2.Types.ObjectId(pumpId),
        });
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
