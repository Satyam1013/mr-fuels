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
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const creditors_schema_1 = require("./creditors.schema");
const date_1 = require("../utils/date");
let CreditorService = class CreditorService {
    constructor(creditorModel) {
        this.creditorModel = creditorModel;
    }
    async create(dto) {
        try {
            return await this.creditorModel.create(dto);
        }
        catch (err) {
            if (err instanceof Error) {
                throw new common_1.InternalServerErrorException("Creation failed", err.message);
            }
            throw new common_1.InternalServerErrorException("Creation failed");
        }
    }
    async findAll(dateString, filterType) {
        let startDate;
        let endDate;
        if (dateString && filterType) {
            ({ startDate, endDate } = (0, date_1.getDateRange)(filterType, dateString));
        }
        const matchStage = startDate && endDate
            ? [{ $match: { "records.time": { $gte: startDate, $lte: endDate } } }]
            : [];
        const aggregationPipeline = [
            ...matchStage,
            { $unwind: "$records" },
            {
                $match: startDate && endDate
                    ? { "records.time": { $gte: startDate, $lte: endDate } }
                    : {},
            },
            {
                $group: {
                    _id: "$_id",
                    date: { $first: "$date" },
                    totalCreditGiven: { $first: "$totalCreditGiven" },
                    totalCreditLeft: { $first: "$totalCreditLeft" },
                    records: { $push: "$records" },
                },
            },
            {
                $project: {
                    _id: 0,
                    id: "$_id",
                    date: 1,
                    totalCreditGiven: 1,
                    totalCreditLeft: 1,
                    records: 1,
                },
            },
            { $sort: { date: -1 } },
        ];
        return this.creditorModel.aggregate(aggregationPipeline);
    }
    async findById(id) {
        const creditor = await this.creditorModel.findById(id);
        if (!creditor)
            throw new common_1.NotFoundException("Creditor not found");
        return creditor;
    }
    async update(id, dto) {
        const updated = await this.creditorModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
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
    __metadata("design:paramtypes", [mongoose_2.Model])
], CreditorService);
