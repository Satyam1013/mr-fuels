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
const personal_expense_schema_1 = require("../personal-expense/personal-expense.schema");
let MachineCalculationService = class MachineCalculationService {
    constructor(machineCalcModel, pumpExpenseModel, personalExpenseModel, prepaidModel, nonFuelModel, creditorModel) {
        this.machineCalcModel = machineCalcModel;
        this.pumpExpenseModel = pumpExpenseModel;
        this.personalExpenseModel = personalExpenseModel;
        this.prepaidModel = prepaidModel;
        this.nonFuelModel = nonFuelModel;
        this.creditorModel = creditorModel;
    }
    async create(adminId, dto) {
        const nozzles = [];
        const startDate = new Date(dto.date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dto.date);
        endDate.setHours(23, 59, 59, 999);
        for (const nozzle of dto.nozzles) {
            const nozzleNumber = parseInt(nozzle.nozzleName.replace(/\D/g, "")) || 1;
            const [creditData, pumpExpenseData, personalExpenseData, prepaidData, nonFuelData,] = await Promise.all([
                this.creditorModel.find({
                    machineId: new mongoose_2.Types.ObjectId(dto.machineId),
                    nozzleNumber,
                    shiftNumber: dto.shiftNumber,
                    date: { $gte: startDate, $lte: endDate },
                }),
                this.pumpExpenseModel.find({
                    machineId: new mongoose_2.Types.ObjectId(dto.machineId),
                    nozzleNumber,
                    shiftNumber: dto.shiftNumber,
                    date: { $gte: startDate, $lte: endDate },
                }),
                this.personalExpenseModel.find({
                    machineId: new mongoose_2.Types.ObjectId(dto.machineId),
                    nozzleNumber,
                    shiftNumber: dto.shiftNumber,
                    date: { $gte: startDate, $lte: endDate },
                }),
                this.prepaidModel.find({
                    machineId: new mongoose_2.Types.ObjectId(dto.machineId),
                    nozzleNumber,
                    shiftNumber: dto.shiftNumber,
                    date: { $gte: startDate, $lte: endDate },
                }),
                this.nonFuelModel.find({
                    machineId: new mongoose_2.Types.ObjectId(dto.machineId),
                    nozzleNumber,
                    shiftNumber: dto.shiftNumber,
                    date: { $gte: startDate, $lte: endDate },
                }),
            ]);
            nozzles.push({
                nozzleNumber,
                lastReading: nozzle.lastReading,
                currentReading: nozzle.currentReading,
                testingLiters: nozzle.testingLiters,
                faultTestingLiters: nozzle.faultTestingLiters,
                pricePerLiter: nozzle.pricePerLiter,
                upiAmount: nozzle.upiAmount,
                posAmount: nozzle.posAmount,
                staffId: new mongoose_2.Types.ObjectId(nozzle.staffId),
                creditIds: creditData.map((c) => c._id),
                pumpExpenseIds: pumpExpenseData.map((e) => e._id),
                personalExpenseIds: personalExpenseData.map((e) => e._id),
                prepaidIds: prepaidData.map((p) => p._id),
                nonFuelProductIds: nonFuelData.map((n) => n._id),
            });
        }
        const calculation = new this.machineCalcModel({
            adminId: new mongoose_2.Types.ObjectId(adminId),
            machineId: new mongoose_2.Types.ObjectId(dto.machineId),
            date: new Date(dto.date),
            shiftNumber: dto.shiftNumber,
            nozzles,
        });
        return calculation.save();
    }
    async getAll(adminId) {
        return this.machineCalcModel
            .find({ adminId: new mongoose_2.Types.ObjectId(adminId) })
            .populate("machineId")
            .populate("nozzles.staffId")
            .populate("nozzles.creditIds")
            .populate("nozzles.pumpExpenseIds")
            .populate("nozzles.personalExpenseIds")
            .populate("nozzles.prepaidIds")
            .populate("nozzles.nonFuelProductIds")
            .sort({ date: -1 });
    }
    async getMachineDetails(adminId, machineId, date, nozzleNumber, shiftNumber) {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        const query = {
            adminId: new mongoose_2.Types.ObjectId(adminId),
            machineId: new mongoose_2.Types.ObjectId(machineId),
            date: { $gte: startDate, $lte: endDate },
        };
        if (shiftNumber) {
            query.shiftNumber = shiftNumber;
        }
        const data = await this.machineCalcModel
            .find(query)
            .populate("machineId")
            .populate("nozzles.staffId")
            .populate("nozzles.creditIds")
            .populate("nozzles.pumpExpenseIds")
            .populate("nozzles.personalExpenseIds")
            .populate("nozzles.prepaidIds")
            .populate("nozzles.nonFuelProductIds");
        if (!nozzleNumber)
            return data;
        // nozzle filter
        return data.map((item) => ({
            ...item.toObject(),
            nozzles: item.nozzles.filter((n) => (parseInt(n.nozzleName.replace(/\D/g, "")) || 1) ===
                Number(nozzleNumber)),
        }));
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
    __param(2, (0, mongoose_1.InjectModel)(personal_expense_schema_1.PersonalExpense.name)),
    __param(3, (0, mongoose_1.InjectModel)(prepaid_schema_1.Prepaid.name)),
    __param(4, (0, mongoose_1.InjectModel)(non_fuel_product_schema_1.NonFuelProducts.name)),
    __param(5, (0, mongoose_1.InjectModel)(creditors_schema_1.Creditor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MachineCalculationService);
