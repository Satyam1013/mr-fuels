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
const fuel_product_schema_1 = require("../fuel-product/fuel-product.schema");
let MachineCalculationService = class MachineCalculationService {
    constructor(machineCalcModel, pumpExpenseModel, personalExpenseModel, prepaidModel, nonFuelModel, creditorModel, fuelProductDetailsModel) {
        this.machineCalcModel = machineCalcModel;
        this.pumpExpenseModel = pumpExpenseModel;
        this.personalExpenseModel = personalExpenseModel;
        this.prepaidModel = prepaidModel;
        this.nonFuelModel = nonFuelModel;
        this.creditorModel = creditorModel;
        this.fuelProductDetailsModel = fuelProductDetailsModel;
    }
    async getFuelProductDetails(adminId) {
        return this.fuelProductDetailsModel.findOne({ adminId }).lean();
    }
    async create(adminId, dto) {
        const nozzles = dto.nozzles.map((nozzle) => {
            // Is nozzle ka staff dhundo
            const assignedStaff = dto.staff.find((s) => s.assignedNozzleNumbers.includes(nozzle.nozzleNumber));
            return {
                nozzleName: nozzle.nozzleName,
                nozzleNumber: nozzle.nozzleNumber,
                fuelProductId: new mongoose_2.Types.ObjectId(nozzle.fuelProductId),
                lastReading: nozzle.lastReading,
                currentReading: nozzle.currentReading,
                testingLiters: nozzle.testingLiters,
                faultTestingLiters: nozzle.faultTestingLiters,
                upiAmount: assignedStaff?.upiAmount || 0,
                posAmount: assignedStaff?.posAmount || 0,
                staffId: assignedStaff
                    ? new mongoose_2.Types.ObjectId(assignedStaff.staffId)
                    : undefined,
            };
        });
        const calculation = new this.machineCalcModel({
            adminId,
            machineId: new mongoose_2.Types.ObjectId(dto.machineId),
            date: new Date(dto.date),
            shiftNumber: dto.shiftNumber,
            nozzles,
            staff: dto.staff.map((s) => ({
                staffId: new mongoose_2.Types.ObjectId(s.staffId),
                assignedNozzleNumbers: s.assignedNozzleNumbers,
                upiAmount: s.upiAmount,
                posAmount: s.posAmount,
            })),
        });
        return calculation.save();
    }
    async getNozzleDetails(adminId, machineId) {
        const calculation = await this.machineCalcModel
            .findOne({
            adminId: new mongoose_2.Types.ObjectId(adminId),
            machineId: new mongoose_2.Types.ObjectId(machineId),
        })
            .sort({ date: -1, shiftNumber: -1 })
            .lean();
        if (!calculation) {
            throw new common_1.NotFoundException("No machine calculation found");
        }
        return calculation.nozzles;
    }
    async getAll(adminId) {
        const [machineCalcs, credits, pumpExpenses, personalExpenses, prepaidEntries, nonFuelSales, fuelProductDetails,] = await Promise.all([
            this.machineCalcModel
                .find({ adminId })
                .populate("machineId")
                .populate("nozzles.staffId")
                .sort({ date: -1 })
                .lean(),
            this.creditorModel.find({ adminId }).lean(),
            this.pumpExpenseModel.find({ adminId }).lean(),
            this.personalExpenseModel.find({ adminId }).lean(),
            this.prepaidModel.find({ adminId }).lean(),
            this.nonFuelModel.find({ adminId }).lean(),
            this.getFuelProductDetails(adminId),
        ]);
        return machineCalcs.map((calc) => ({
            ...calc,
            nozzles: calc.nozzles.map((nozzle) => {
                const product = fuelProductDetails?.products.find((p) => p._id.toString() === nozzle.fuelProductId.toString());
                return {
                    ...nozzle,
                    fuelType: product?.fuelType,
                    pricePerLiter: product?.price || 0,
                };
            }),
            credits,
            pumpExpenses,
            personalExpenses,
            prepaidEntries,
            nonFuelSales,
        }));
    }
    async getMachineDetails(adminId, machineId, date, nozzleNumber, shiftNumber) {
        const objectMachineId = new mongoose_2.Types.ObjectId(machineId);
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);
        const baseQuery = {
            adminId,
            machineId: objectMachineId,
            date: { $gte: startDate, $lte: endDate },
        };
        if (shiftNumber) {
            baseQuery.shiftNumber = Number(shiftNumber);
        }
        const [machineCalcData, creditEntries, pumpExpenses, personalExpenses, prepaidEntries, nonFuelSales, fuelProductDetails,] = await Promise.all([
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
            this.getFuelProductDetails(adminId),
        ]);
        // Nozzles me price attach karo
        const machineCalcWithPrice = machineCalcData.map((item) => ({
            ...item,
            nozzles: item.nozzles.map((nozzle) => {
                const product = fuelProductDetails?.products.find((p) => p._id.toString() ===
                    nozzle.fuelProductId.toString());
                return {
                    ...nozzle,
                    fuelType: product?.fuelType,
                    pricePerLiter: product?.price || 0,
                };
            }),
        }));
        let previousEntry = null;
        if (shiftNumber) {
            previousEntry = await this.machineCalcModel
                .findOne({
                adminId,
                machineId: objectMachineId,
                $or: [
                    {
                        date: { $gte: startDate, $lte: endDate },
                        shiftNumber: { $lt: Number(shiftNumber) },
                    },
                    { date: { $lt: startDate } },
                ],
            })
                .sort({ date: -1, shiftNumber: -1 })
                .lean();
        }
        else {
            previousEntry = await this.machineCalcModel
                .findOne({
                adminId,
                machineId: objectMachineId,
                date: { $lt: startDate },
            })
                .sort({ date: -1, shiftNumber: -1 })
                .lean();
        }
        let filteredMachineData = machineCalcWithPrice; // machineCalcData → machineCalcWithPrice
        if (nozzleNumber) {
            filteredMachineData = machineCalcWithPrice.map((item) => ({
                ...item,
                nozzles: item.nozzles.filter((n) => n.nozzleNumber === Number(nozzleNumber)),
            }));
        }
        if (previousEntry) {
            filteredMachineData = filteredMachineData.map((item) => {
                const updatedNozzles = item.nozzles.map((nozzle) => {
                    const prevNozzle = previousEntry.nozzles.find((n) => n.nozzleNumber === nozzle.nozzleNumber);
                    return {
                        ...nozzle,
                        lastReading: prevNozzle?.currentReading ?? nozzle.lastReading ?? 0,
                    };
                });
                return { ...item, nozzles: updatedNozzles };
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
    __param(6, (0, mongoose_1.InjectModel)(fuel_product_schema_1.FuelProductDetails.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], MachineCalculationService);
