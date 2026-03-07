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
exports.MachineCalculationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const machine_calculation_schema_1 = require("./machine-calculation.schema");
const pump_expense_schema_1 = require("../pump-expense/pump-expense.schema");
const prepaid_schema_1 = require("../prepaid/prepaid.schema");
const non_fuel_product_schema_1 = require("../non-fuel-product/non-fuel-product.schema");
const creditors_schema_1 = require("../creditors/creditors.schema");
let MachineCalculationService = class MachineCalculationService {
    constructor(machineCalcModel, pumpExpenseModel, prepaidModel, nonFuelModel, creditorModel) {
        this.machineCalcModel = machineCalcModel;
        this.pumpExpenseModel = pumpExpenseModel;
        this.prepaidModel = prepaidModel;
        this.nonFuelModel = nonFuelModel;
        this.creditorModel = creditorModel;
    }
    async create(adminId, dto) {
        const nozzles = [];
        for (const nozzle of dto.nozzles) {
            // creditor transactions
            const creditData = await this.creditorModel.find({
                machineId: dto.machineId,
                nozzleNumber: nozzle.nozzleNumber,
                shiftNumber: dto.shiftNumber,
                date: dto.date,
            });
            console.log("🚀 ~ create ~ creditData:", creditData);
            // pump expense
            const pumpExpenseData = await this.pumpExpenseModel.find({
                adminId,
                machineId: dto.machineId,
                nozzleNumber: nozzle.nozzleNumber,
                shiftNumber: dto.shiftNumber,
                date: dto.date,
            });
            // prepaid
            const prepaidData = await this.prepaidModel.find({
                adminId,
                machineId: dto.machineId,
                nozzleNumber: nozzle.nozzleNumber,
                shiftNumber: dto.shiftNumber,
                date: dto.date,
            });
            // lubricant / non fuel
            const nonFuelData = await this.nonFuelModel.find({
                adminId,
                machineId: dto.machineId,
                nozzleNumber: nozzle.nozzleNumber,
                shiftNumber: dto.shiftNumber,
                date: dto.date,
            });
            // totals
            const creditTotal = creditData.reduce((s, c) => s + c.amount, 0);
            const pumpExpenseTotal = pumpExpenseData.reduce((s, c) => s + c.amount, 0);
            const prepaidTotal = prepaidData.reduce((s, c) => s + c.amount, 0);
            const lubricantTotal = nonFuelData.reduce((s, c) => s + c.amount, 0);
            const expenseTotal = pumpExpenseTotal;
            const finalAmount = nozzle.fuelSaleAmount +
                lubricantTotal +
                prepaidTotal -
                creditTotal -
                expenseTotal;
            nozzles.push({
                ...nozzle,
                creditTotal,
                expenseTotal,
                prepaidTotal,
                lubricantTotal,
                finalAmount,
            });
        }
        const calculation = new this.machineCalcModel({
            adminId,
            machineId: new mongoose_2.Types.ObjectId(dto.machineId),
            date: dto.date,
            shiftNumber: dto.shiftNumber,
            nozzles,
        });
        return calculation.save();
    }
    async getAll(adminId) {
        return this.machineCalcModel
            .find({ adminId })
            .populate("machineId")
            .populate("nozzles.staffId");
    }
    async getById(id) {
        return this.machineCalcModel.findById(id);
    }
    async remove(id) {
        return this.machineCalcModel.findByIdAndDelete(id);
    }
};
exports.MachineCalculationService = MachineCalculationService;
exports.MachineCalculationService = MachineCalculationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(machine_calculation_schema_1.MachineCalculation.name)),
    __param(1, (0, mongoose_1.InjectModel)(pump_expense_schema_1.PumpExpense.name)),
    __param(2, (0, mongoose_1.InjectModel)(prepaid_schema_1.Prepaid.name)),
    __param(3, (0, mongoose_1.InjectModel)(non_fuel_product_schema_1.NonFuelProduct.name)),
    __param(4, (0, mongoose_1.InjectModel)(creditors_schema_1.Creditor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MachineCalculationService);
