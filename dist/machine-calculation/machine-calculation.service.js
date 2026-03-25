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
            nozzles.push({
                nozzleName: nozzle.nozzleName,
                nozzleNumber: nozzle.nozzleNumber,
                lastReading: nozzle.lastReading,
                currentReading: nozzle.currentReading,
                testingLiters: nozzle.testingLiters,
                faultTestingLiters: nozzle.faultTestingLiters,
                pricePerLiter: nozzle.pricePerLiter,
                upiAmount: nozzle.upiAmount,
                posAmount: nozzle.posAmount,
                staffId: new mongoose_2.Types.ObjectId(nozzle.staffId),
            });
        }
        const calculation = new this.machineCalcModel({
            adminId,
            machineId: new mongoose_2.Types.ObjectId(dto.machineId),
            date: new Date(dto.date),
            shiftNumber: dto.shiftNumber,
            nozzles,
        });
        return calculation.save();
    }
    async getAll(adminId) {
        const machineCalcs = await this.machineCalcModel
            .find({ adminId })
            .populate("machineId")
            .populate("nozzles.staffId")
            .sort({ date: -1 })
            .lean();
        const results = [];
        for (const calc of machineCalcs) {
            const [credits, pumpExpenses, personalExpenses, prepaidEntries, nonFuelSales,] = await Promise.all([
                this.creditorModel.find({
                    adminId,
                }),
                this.pumpExpenseModel.find({
                    adminId,
                }),
                this.personalExpenseModel.find({
                    adminId,
                }),
                this.prepaidModel.find({
                    adminId,
                }),
                this.nonFuelModel.find({
                    adminId,
                }),
            ]);
            results.push({
                ...calc,
                credits,
                pumpExpenses,
                personalExpenses,
                prepaidEntries,
                nonFuelSales,
            });
        }
        return results;
    }
    async getMachineDetails(adminId, machineId, date, nozzleNumber, shiftNumber) {
        const objectAdminId = new mongoose_2.Types.ObjectId(adminId);
        const objectMachineId = new mongoose_2.Types.ObjectId(machineId);
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        const baseQuery = {
            adminId: objectAdminId,
            machineId: objectMachineId,
            date: { $gte: startDate, $lte: endDate },
        };
        if (shiftNumber) {
            baseQuery.shiftNumber = Number(shiftNumber);
        }
        const [machineCalcData, creditEntries, pumpExpenses, personalExpenses, prepaidEntries, nonFuelSales,] = await Promise.all([
            this.machineCalcModel
                .find(baseQuery)
                .populate("machineId")
                .populate("nozzles.staffId")
                .lean(),
            this.creditorModel.find(baseQuery),
            this.pumpExpenseModel.find(baseQuery),
            this.personalExpenseModel.find(baseQuery),
            this.prepaidModel.find(baseQuery),
            this.nonFuelModel.find(baseQuery),
        ]);
        // 🔥 FETCH PREVIOUS ENTRY (important logic)
        let previousEntry = null;
        if (shiftNumber) {
            // Case: Shift provided → check same day previous shift OR previous date
            previousEntry = await this.machineCalcModel
                .findOne({
                adminId: objectAdminId,
                machineId: objectMachineId,
                $or: [
                    {
                        date: { $gte: startDate, $lte: endDate },
                        shiftNumber: { $lt: Number(shiftNumber) },
                    },
                    {
                        date: { $lt: startDate },
                    },
                ],
            })
                .sort({ date: -1, shiftNumber: -1 })
                .lean();
        }
        else {
            // Case: No shift → just previous date
            previousEntry = await this.machineCalcModel
                .findOne({
                adminId: objectAdminId,
                machineId: objectMachineId,
                date: { $lt: startDate },
            })
                .sort({ date: -1, shiftNumber: -1 })
                .lean();
        }
        // 🔥 FILTER NOZZLE (if provided)
        let filteredMachineData = machineCalcData;
        if (nozzleNumber) {
            filteredMachineData = machineCalcData.map((item) => ({
                ...item,
                nozzles: item.nozzles.filter((n) => n.nozzleNumber === Number(nozzleNumber)),
            }));
        }
        // 🔥 APPLY PREVIOUS READING LOGIC
        if (previousEntry) {
            filteredMachineData = filteredMachineData.map((item) => {
                const updatedNozzles = item.nozzles.map((nozzle) => {
                    const prevNozzle = previousEntry.nozzles.find((n) => n.nozzleNumber === nozzle.nozzleNumber);
                    return {
                        ...nozzle,
                        lastReading: prevNozzle?.currentReading ?? nozzle.lastReading ?? 0,
                    };
                });
                return {
                    ...item,
                    nozzles: updatedNozzles,
                };
            });
        }
        return {
            machine: filteredMachineData,
            creditors: creditEntries,
            pumpExpenses,
            personalExpenses,
            prepaidEntries,
            nonFuelSales,
        };
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
