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
exports.CashCollectionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cash_collection_schema_1 = require("./cash-collection.schema");
let CashCollectionService = class CashCollectionService {
    constructor(cashCollectionModel) {
        this.cashCollectionModel = cashCollectionModel;
    }
    async create(adminId, dto) {
        const cash = await this.cashCollectionModel.create({
            adminId,
            staffId: new mongoose_2.Types.ObjectId(dto.staffId),
            shiftNumber: dto.shiftNumber,
            date: new Date(dto.date),
            denominations: dto.denominations,
            totalAmount: dto.totalAmount,
        });
        return {
            message: "Cash collection saved successfully",
            data: cash,
        };
    }
    async findAll(adminId) {
        const data = await this.cashCollectionModel
            .find({ adminId })
            .populate("staffId", "staffName")
            .sort({ createdAt: -1 })
            .lean();
        return { message: "Cash collections fetched successfully", data };
    }
    async findByShift(adminId, date, shiftNumber) {
        const data = await this.cashCollectionModel
            .find({
            adminId,
            date: new Date(date),
            shiftNumber,
        })
            .populate("staffId", "staffName")
            .sort({ createdAt: -1 })
            .lean();
        return {
            message: "Cash collections fetched successfully",
            date,
            shiftNumber,
            totalEntries: data.length,
            totalCash: data.reduce((sum, d) => sum + (d.totalAmount || 0), 0),
            data,
        };
    }
    async findOne(adminId, id) {
        const data = await this.cashCollectionModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), adminId })
            .populate("staffId", "staffName")
            .lean();
        if (!data) {
            throw new common_1.NotFoundException("Cash collection not found");
        }
        return { message: "Cash collection fetched successfully", data };
    }
    async update(adminId, id, dto) {
        const updated = await this.cashCollectionModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), adminId }, {
            $set: {
                ...(dto.staffId && { staffId: new mongoose_2.Types.ObjectId(dto.staffId) }),
                ...(dto.shiftNumber && { shiftNumber: dto.shiftNumber }),
                ...(dto.date && { date: new Date(dto.date) }),
                ...(dto.denominations && { denominations: dto.denominations }),
                ...(dto.totalAmount && { totalAmount: dto.totalAmount }),
            },
        }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException("Cash collection not found");
        }
        return { message: "Cash collection updated successfully", data: updated };
    }
    async remove(adminId, id) {
        const deleted = await this.cashCollectionModel.findOneAndDelete({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!deleted) {
            throw new common_1.NotFoundException("Cash collection not found");
        }
        return { message: "Cash collection deleted successfully" };
    }
};
exports.CashCollectionService = CashCollectionService;
exports.CashCollectionService = CashCollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cash_collection_schema_1.CashCollection.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CashCollectionService);
