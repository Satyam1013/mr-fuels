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
exports.SalesService = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transactions_schema_1 = require("../transactions/transactions.schema");
const machines_schema_1 = require("../machines/machines.schema");
const staff_schema_1 = require("../staff/staff.schema");
const pump_details_schema_1 = require("../pump-details/pump-details.schema");
const non_fuel_product_schema_1 = require("../non-fuel-product/non-fuel-product.schema");
let SalesService = class SalesService {
    constructor(machineModel, transactionModel, nonFuelModel, staffModel, pumpDetailsModel) {
        this.machineModel = machineModel;
        this.transactionModel = transactionModel;
        this.nonFuelModel = nonFuelModel;
        this.staffModel = staffModel;
        this.pumpDetailsModel = pumpDetailsModel;
    }
    async getDashboardSetup(adminId) {
        const objectAdminId = new mongoose_2.Types.ObjectId(adminId);
        // =============================
        // 1️⃣ Machines
        // =============================
        const machines = await this.machineModel
            .find({ adminId: objectAdminId, isActive: true })
            .lean();
        // Fuel Types from Nozzles
        const fuelSet = new Set();
        machines.forEach((machine) => {
            if (!Array.isArray(machine.nozzle))
                return;
            machine.nozzle.forEach((n) => {
                if (n?.isActive && n?.fuelType) {
                    fuelSet.add(n.fuelType.toLowerCase());
                }
            });
        });
        const fuelProducts = {};
        fuelSet.forEach((type) => {
            fuelProducts[type] = { liters: 0, amount: 0 };
        });
        // =============================
        // 2️⃣ Non Fuel Products (Lubricants)
        // =============================
        const nonFuelProductsData = await this.nonFuelModel
            .find({ adminId: objectAdminId })
            .lean();
        const nonFuelProducts = nonFuelProductsData.map((product) => ({
            productName: product.productName,
            unitType: product.unitType,
            quantity: product.totalStock,
            pricePerUnit: product.price,
            amountCollected: product.amountCollected ?? 0,
        }));
        // =============================
        // 3️⃣ Transaction Details
        // =============================
        const transaction = await this.transactionModel
            .findOne({ adminId: objectAdminId })
            .lean();
        const upiApps = transaction?.upiApps.map((app) => ({
            name: app.name,
            amount: 0,
            imageUrl: "",
        })) || [];
        const posMachines = transaction?.swipeMachine
            ? [
                {
                    machineName: transaction.swipeMachine,
                    amount: 0,
                    imgUrl: "",
                },
            ]
            : [];
        // =============================
        // 4️⃣ Machine Details
        // =============================
        const machineDetails = machines.map((machine) => ({
            name: machine.machineNumber,
            machineId: machine._id,
            nozzles: Array.isArray(machine.nozzle)
                ? machine.nozzle.map((n, index) => ({
                    nozzleName: `Nozzle ${index + 1}`,
                    nozzleNumber: n?.nozzleNumber || 0,
                    lastReading: 0,
                    currentReading: 0,
                    fuelType: n?.fuelType || "",
                    fuelPrice: Number(n?.price || 0),
                    faultTesting: false,
                    faultDesc: null,
                    faultImg: null,
                    imageUrl: "",
                }))
                : [],
        }));
        // =============================
        // 5️⃣ Staff (Last 4 sections replacement)
        // =============================
        const staff = await this.staffModel.find({ adminId: objectAdminId }).lean();
        const staffDetails = staff.map((s) => ({
            name: s.staffName,
            id: s.staffNumber,
            shift: s.shift,
            salary: s.salary,
        }));
        return {
            overallSales: {
                fuelProducts,
                nonFuelProducts,
            },
            upiApps,
            posMachines,
            machineDetails,
            creditors: [],
            pumpExpense: [],
            personalExpenses: [],
            othersCash: [],
            lubricants: [],
            prepaidEntry: [],
            cashCollection: {},
            staffDetails,
        };
    }
    async getShiftDashboard(adminId) {
        const objectAdminId = new mongoose_2.Types.ObjectId(adminId);
        const pumpDetails = await this.pumpDetailsModel
            .findOne({ adminId: objectAdminId })
            .lean();
        if (!pumpDetails) {
            throw new Error("Pump details not found");
        }
        const today = new Date();
        const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD
        // Generate unique shift staffId from date
        const generatedShiftId = Number(formattedDate.replace(/-/g, "") + "01");
        return {
            date: formattedDate,
            totalShifts: pumpDetails.numberOfShifts,
            currentShift: {
                shiftId: 1,
                staffId: generatedShiftId,
                name: `Shift 1`,
                startTime: pumpDetails.pumpTime.start,
                endTime: "",
                status: "Active",
            },
            shifts: [],
            dailyProgress: {
                completedShifts: 0,
                pendingShifts: pumpDetails.numberOfShifts,
                overallCompletionPercent: 0,
            },
        };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(machines_schema_1.Machine.name)),
    __param(1, (0, mongoose_1.InjectModel)(transactions_schema_1.TransactionDetails.name)),
    __param(2, (0, mongoose_1.InjectModel)(non_fuel_product_schema_1.NonFuelProducts.name)),
    __param(3, (0, mongoose_1.InjectModel)(staff_schema_1.Staff.name)),
    __param(4, (0, mongoose_1.InjectModel)(pump_details_schema_1.PumpDetails.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SalesService);
