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
const machines_schema_1 = require("../machines/machines.schema");
let CashCollectionService = class CashCollectionService {
    constructor(cashCollectionModel, machineModel) {
        this.cashCollectionModel = cashCollectionModel;
        this.machineModel = machineModel;
    }
    async create(adminId, dto) {
        const machine = await this.machineModel.findOne({
            _id: new mongoose_2.Types.ObjectId(dto.machineId),
            adminId,
        });
        if (!machine) {
            throw new common_1.BadRequestException("Machine not found");
        }
        const nozzle = machine.nozzle.find((n) => n.nozzleNumber === dto.nozzleNumber && n.isActive);
        if (!nozzle) {
            throw new common_1.BadRequestException("Invalid nozzle number");
        }
        const cash = await this.cashCollectionModel.create({
            adminId,
            machineId: new mongoose_2.Types.ObjectId(dto.machineId),
            nozzleNumber: dto.nozzleNumber,
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
            .find({
            adminId,
        })
            .sort({ createdAt: -1 });
        return {
            message: "Cash collections fetched successfully",
            data,
        };
    }
    async findOne(adminId, id) {
        const data = await this.cashCollectionModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!data) {
            throw new common_1.BadRequestException("Cash collection not found");
        }
        return {
            message: "Cash collection fetched successfully",
            data,
        };
    }
    async update(adminId, id, dto) {
        const existing = await this.cashCollectionModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!existing) {
            throw new common_1.BadRequestException("Cash collection not found");
        }
        const updated = await this.cashCollectionModel.findByIdAndUpdate(id, {
            ...dto,
            ...(dto.machineId && { machineId: new mongoose_2.Types.ObjectId(dto.machineId) }),
            ...(dto.date && { date: new Date(dto.date) }),
        }, { new: true });
        return {
            message: "Cash collection updated successfully",
            data: updated,
        };
    }
    async remove(adminId, id) {
        const existing = await this.cashCollectionModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!existing) {
            throw new common_1.BadRequestException("Cash collection not found");
        }
        await this.cashCollectionModel.findByIdAndDelete(id);
        return {
            message: "Cash collection deleted successfully",
        };
    }
};
exports.CashCollectionService = CashCollectionService;
exports.CashCollectionService = CashCollectionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cash_collection_schema_1.CashCollection.name)),
    __param(1, (0, mongoose_1.InjectModel)(machines_schema_1.Machine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CashCollectionService);
