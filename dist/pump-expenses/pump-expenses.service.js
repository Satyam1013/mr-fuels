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
exports.PumpExpenseService = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pump_expenses_schema_1 = require("./pump-expenses.schema");
const cloudinary_1 = require("../utils/cloudinary");
const date_1 = require("../utils/date");
let PumpExpenseService = class PumpExpenseService {
    constructor(pumpExpenseModel) {
        this.pumpExpenseModel = pumpExpenseModel;
    }
    async create(dto, images, pumpId) {
        if (images?.length) {
            for (let i = 0; i < dto.entries.length; i++) {
                if (images[i]) {
                    const upload = await (0, cloudinary_1.uploadPdfBufferToCloudinary)(images[i].buffer, images[i].originalname);
                    dto.entries[i].imageUrl = upload.secure_url;
                }
            }
        }
        return this.pumpExpenseModel.create({
            pumpId: new mongoose_2.Types.ObjectId(pumpId),
            date: dto.date,
            entries: dto.entries,
        });
    }
    async findAll(pumpId, dateString, filterType) {
        let startDate;
        let endDate;
        if (dateString && filterType) {
            ({ startDate, endDate } = (0, date_1.getDateRange)(filterType, dateString));
        }
        const matchStage = [
            { $match: { pumpId: new mongoose_2.Types.ObjectId(pumpId) } },
        ];
        if (startDate && endDate) {
            matchStage.push({
                $match: {
                    date: { $gte: startDate, $lte: endDate },
                },
            });
        }
        const aggregationPipeline = [
            ...matchStage,
            {
                $project: {
                    _id: 0,
                    date: 1,
                    entries: 1,
                },
            },
            {
                $group: {
                    _id: "$date",
                    entries: { $push: "$entries" },
                },
            },
            {
                $project: {
                    date: "$_id",
                    entries: {
                        $reduce: {
                            input: "$entries",
                            initialValue: [],
                            in: { $concatArrays: ["$$value", "$$this"] },
                        },
                    },
                    _id: 0,
                },
            },
            {
                $sort: { date: -1 },
            },
        ];
        return this.pumpExpenseModel.aggregate(aggregationPipeline);
    }
    async findById(id) {
        const doc = await this.pumpExpenseModel.findById(id);
        if (!doc)
            throw new common_1.NotFoundException("Expense not found");
        return doc;
    }
    async update(id, dto) {
        const updated = await this.pumpExpenseModel.findByIdAndUpdate(id, { $set: { entries: dto.entries } }, { new: true });
        if (!updated)
            throw new common_1.NotFoundException("Expense not found");
        return updated;
    }
    async delete(id) {
        const deleted = await this.pumpExpenseModel.findByIdAndDelete(id);
        if (!deleted)
            throw new common_1.NotFoundException("Expense not found");
        return { message: "Expense deleted successfully" };
    }
};
exports.PumpExpenseService = PumpExpenseService;
exports.PumpExpenseService = PumpExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pump_expenses_schema_1.PumpExpense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PumpExpenseService);
