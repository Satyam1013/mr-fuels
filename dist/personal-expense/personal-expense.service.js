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
exports.PersonalExpenseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const personal_expense_schema_1 = require("./personal-expense.schema");
let PersonalExpenseService = class PersonalExpenseService {
    constructor(personalExpenseModel) {
        this.personalExpenseModel = personalExpenseModel;
    }
    async create(adminId, dto) {
        const expense = new this.personalExpenseModel({
            ...dto,
            adminId,
            creditBy: new mongoose_2.Types.ObjectId(dto.creditBy),
            date: new Date(dto.date),
        });
        return expense.save();
    }
    async findAll(adminId) {
        return this.personalExpenseModel
            .find({ adminId })
            .sort({ createdAt: -1 })
            .lean();
    }
    async findOne(adminId, id) {
        const record = await this.personalExpenseModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), adminId })
            .lean();
        if (!record) {
            throw new common_1.NotFoundException(`Personal expense ${id} not found.`);
        }
        return record;
    }
    async patch(adminId, id, dto) {
        const updated = await this.personalExpenseModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), adminId }, {
            $set: {
                ...(dto.name && { name: dto.name }),
                ...(dto.date && { date: new Date(dto.date) }),
                ...(dto.shiftNumber && { shiftNumber: dto.shiftNumber }),
                ...(dto.amount && { amount: dto.amount }),
                ...(dto.category && { category: dto.category }),
                ...(dto.creditBy && {
                    creditBy: new mongoose_2.Types.ObjectId(dto.creditBy),
                }),
                ...(dto.narration !== undefined && { narration: dto.narration }),
                ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
            },
        }, { new: true });
        if (!updated) {
            throw new common_1.NotFoundException(`Personal expense ${id} not found.`);
        }
        return {
            message: "Personal expense updated successfully",
            data: updated,
        };
    }
    async remove(adminId, id) {
        const deleted = await this.personalExpenseModel.findOneAndDelete({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!deleted) {
            throw new common_1.NotFoundException(`Personal expense ${id} not found.`);
        }
        return { message: "Personal expense deleted successfully" };
    }
};
exports.PersonalExpenseService = PersonalExpenseService;
exports.PersonalExpenseService = PersonalExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(personal_expense_schema_1.PersonalExpense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], PersonalExpenseService);
