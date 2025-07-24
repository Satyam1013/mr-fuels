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
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pump_expenses_schema_1 = require("./pump-expenses.schema");
let PumpExpenseService = class PumpExpenseService {
    constructor(pumpExpenseModel) {
        this.pumpExpenseModel = pumpExpenseModel;
    }
    async create(dto) {
        return this.pumpExpenseModel.create(dto);
    }
    async findAll() {
        return this.pumpExpenseModel.find().sort({ date: -1 });
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
