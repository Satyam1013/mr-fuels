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
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transactions_schema_1 = require("../transactions/transactions.schema");
const machines_schema_1 = require("../machines/machines.schema");
const staff_schema_1 = require("../staff/staff.schema");
const non_fuel_product_schema_1 = require("../non-fuel-product/non-fuel-product.schema");
const fuel_product_schema_1 = require("../fuel-product/fuel-product.schema");
const sales_schema_1 = require("./sales.schema");
const shift_status_enum_1 = require("../shift-status/shift-status.enum");
let SalesService = class SalesService {
    constructor(machineModel, transactionModel, nonFuelModel, staffModel, fuelProductDetailsModel, salesModel) {
        this.machineModel = machineModel;
        this.transactionModel = transactionModel;
        this.nonFuelModel = nonFuelModel;
        this.staffModel = staffModel;
        this.fuelProductDetailsModel = fuelProductDetailsModel;
        this.salesModel = salesModel;
    }
    async getDashboardSetup(adminId) {
        // =============================
        // 1️⃣ Machines + FuelProductDetails
        // =============================
        const [machines, fuelProductDetails] = await Promise.all([
            this.machineModel.find({ adminId, isActive: true }).lean(),
            this.fuelProductDetailsModel.findOne({ adminId }).lean(),
        ]);
        // Helper — fuelProductId se product nikalo
        const getProduct = (fuelProductId) => fuelProductDetails?.products.find((p) => p._id.toString() === fuelProductId.toString());
        // Fuel Types from Nozzles
        const fuelSet = new Set();
        machines.forEach((machine) => {
            if (!Array.isArray(machine.nozzle))
                return;
            machine.nozzle.forEach((n) => {
                if (n.isActive) {
                    const product = n.fuelProductId ? getProduct(n.fuelProductId) : null;
                    const fuelType = product?.fuelType || n.fuelType;
                    if (fuelType) {
                        fuelSet.add(fuelType.toLowerCase());
                    }
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
            .find({ adminId })
            .lean();
        const nonFuelProducts = nonFuelProductsData.map((product) => ({
            id: product._id,
            productName: product.productName,
            unitType: product.unitType,
            quantity: product.totalStock,
            pricePerUnit: product.price,
            amountCollected: product.amountCollected ?? 0,
        }));
        // =============================
        // 3️⃣ Transaction Details
        // =============================
        const transaction = await this.transactionModel.findOne({ adminId }).lean();
        const upiApps = transaction?.upiApps.map((app) => ({
            name: app.name,
            amount: 0,
            imageUrl: "",
        })) || [];
        const posMachines = Array.isArray(transaction?.posMachines)
            ? transaction.posMachines.map((machine) => ({
                machineName: machine.name,
                amount: 0,
                imgUrl: "",
            }))
            : [];
        // =============================
        // 4️⃣ Machine Details
        // =============================
        const machineDetails = machines.map((machine) => ({
            name: machine.machineNumber,
            machineId: machine._id,
            nozzles: Array.isArray(machine.nozzle)
                ? machine.nozzle.map((n, index) => {
                    const product = n.fuelProductId
                        ? getProduct(n.fuelProductId)
                        : null;
                    return {
                        nozzleName: `Nozzle ${index + 1}`,
                        nozzleNumber: n?.nozzleNumber || 0,
                        lastReading: 0,
                        currentReading: 0,
                        fuelProductId: n.fuelProductId ?? null,
                        fuelType: product?.fuelType || n.fuelType || "",
                        fuelPrice: product?.price || n.price || 0,
                        faultTesting: false,
                        faultDesc: null,
                        faultImg: null,
                        imageUrl: "",
                    };
                })
                : [],
        }));
        // =============================
        // 5️⃣ Staff
        // =============================
        const staff = await this.staffModel.find({ adminId }).lean();
        const staffDetails = staff.map((s) => ({
            name: s.staffName,
            id: s._id,
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
    async getSalesReport(params) {
        const { adminId } = params;
        // ─── Single shift ───
        if (params.type === "single") {
            const record = await this.salesModel
                .findOne({
                adminId,
                date: params.date,
                shiftNumber: params.shiftNumber,
            })
                .lean();
            if (!record) {
                throw new common_1.NotFoundException(`No sales data found for date ${params.date} shift ${params.shiftNumber}. Shift may not be closed yet.`);
            }
            return record;
        }
        const { filterType, startDate, endDate, calculationMode } = params;
        const salesRecords = await this.salesModel
            .find({
            adminId,
            date: { $gte: startDate, $lte: endDate },
            shiftStatus: shift_status_enum_1.ShiftStatusEnum.COMPLETED,
        })
            .sort({ date: 1, shiftNumber: 1 })
            .lean();
        if (!salesRecords.length) {
            throw new common_1.NotFoundException(`No sales data found for ${filterType} range ${startDate} to ${endDate}.`);
        }
        // ─── SHIFTWISE → har shift alag alag ───
        if (calculationMode === "shiftwise") {
            const data = salesRecords.map((record) => ({
                date: record.date,
                shiftNumber: record.shiftNumber,
                shiftStatus: record.shiftStatus,
                overallSales: record.overallSales,
                netSales: record.netSales,
                testing: record.testing,
                overallCreditorsAmount: record.overallCreditorsAmount,
                prepaid: record.prepaid,
                pumpExpenses: record.pumpExpenses,
                personalExpenses: record.personalExpenses,
                lubricantSales: record.lubricantSales,
                transactions: record.transactions,
                machines: record.machines,
                staff: record.staff || [], // ✅ staff add
            }));
            return {
                filterType,
                startDate,
                endDate,
                calculationMode,
                totalShifts: data.length,
                data,
            };
        }
        const dailyMap = new Map();
        for (const record of salesRecords) {
            const key = record.date;
            if (!dailyMap.has(key)) {
                dailyMap.set(key, {
                    date: record.date,
                    shifts: [],
                    overallSales: { liters: 0, amount: 0 },
                    netSales: { liters: 0, amount: 0 },
                    testing: { liters: 0, amount: 0 },
                    overallCreditorsAmount: 0,
                    prepaid: 0,
                    pumpExpenses: 0,
                    personalExpenses: 0,
                    lubricantSales: 0,
                    transactions: { upi: 0, pos: 0 },
                    nozzleMap: new Map(),
                    staffMap: new Map(), // ✅
                });
            }
            const day = dailyMap.get(key);
            day.shifts.push({
                shiftNumber: record.shiftNumber,
                shiftStatus: record.shiftStatus,
            });
            day.overallSales.liters += record.overallSales?.liters || 0;
            day.overallSales.amount += record.overallSales?.amount || 0;
            day.netSales.liters += record.netSales?.liters || 0;
            day.netSales.amount += record.netSales?.amount || 0;
            day.testing.liters += record.testing?.liters || 0;
            day.testing.amount += record.testing?.amount || 0;
            day.overallCreditorsAmount += record.overallCreditorsAmount || 0;
            day.prepaid += record.prepaid || 0;
            day.pumpExpenses += record.pumpExpenses || 0;
            day.personalExpenses += record.personalExpenses || 0;
            day.lubricantSales += record.lubricantSales || 0;
            day.transactions.upi +=
                record.transactions?.upi || 0;
            day.transactions.pos +=
                record.transactions?.pos || 0;
            // ─── Nozzle aggregate ───
            const nozzles = record.machines?.nozzles || [];
            for (const nozzle of nozzles) {
                const existing = day.nozzleMap.get(nozzle.nozzleNumber);
                if (existing) {
                    existing.sales.liters += nozzle.sales?.liters || 0;
                    existing.sales.amount += nozzle.sales?.amount || 0;
                    existing.netSales.liters += nozzle.netSales?.liters || 0;
                    existing.netSales.amount += nozzle.netSales?.amount || 0;
                    existing.testing.liters += nozzle.testing?.liters || 0;
                    existing.testing.amount += nozzle.testing?.amount || 0;
                }
                else {
                    day.nozzleMap.set(nozzle.nozzleNumber, {
                        nozzleNumber: nozzle.nozzleNumber,
                        fuelType: nozzle.fuelType,
                        staffId: nozzle.staffId,
                        sales: {
                            liters: nozzle.sales?.liters || 0,
                            amount: nozzle.sales?.amount || 0,
                        },
                        netSales: {
                            liters: nozzle.netSales?.liters || 0,
                            amount: nozzle.netSales?.amount || 0,
                        },
                        testing: {
                            liters: nozzle.testing?.liters || 0,
                            amount: nozzle.testing?.amount || 0,
                        },
                    });
                }
            }
            // ─── Staff aggregate ✅ ───
            const staffList = record.staff || [];
            for (const staff of staffList) {
                const staffIdStr = String(staff.staffId);
                if (!staffIdStr)
                    continue;
                if (!day.staffMap.has(staffIdStr)) {
                    day.staffMap.set(staffIdStr, {
                        staffId: new mongoose_2.Types.ObjectId(staffIdStr),
                        staffName: staff.staffName || "",
                        machineId: staff.machineId,
                        nozzleNumber: staff.nozzleNumber,
                        fuelType: staff.fuelType || null,
                        sales: { liters: 0, amount: 0 },
                        netSales: { liters: 0, amount: 0 },
                        testing: { liters: 0, amount: 0 },
                        creditors: 0,
                        prepaid: 0,
                        lubricantSales: 0,
                        transactions: { upi: 0, pos: 0 },
                        pumpExpenses: 0,
                        personalExpenses: 0,
                    });
                }
                const staffEntry = day.staffMap.get(staffIdStr);
                staffEntry.sales.liters += staff.sales?.liters || 0;
                staffEntry.sales.amount += staff.sales?.amount || 0;
                staffEntry.netSales.liters += staff.netSales?.liters || 0;
                staffEntry.netSales.amount += staff.netSales?.amount || 0;
                staffEntry.testing.liters += staff.testing?.liters || 0;
                staffEntry.testing.amount += staff.testing?.amount || 0;
                staffEntry.creditors += staff.creditors || 0;
                staffEntry.prepaid += staff.prepaid || 0;
                staffEntry.lubricantSales += staff.lubricantSales || 0;
                staffEntry.transactions.upi += staff.transactions?.upi || 0;
                staffEntry.transactions.pos += staff.transactions?.pos || 0;
                staffEntry.pumpExpenses += staff.pumpExpenses || 0;
                staffEntry.personalExpenses += staff.personalExpenses || 0;
            }
        }
        const dailyData = Array.from(dailyMap.values()).map((day) => ({
            date: day.date,
            shifts: day.shifts,
            overallSales: day.overallSales,
            netSales: day.netSales,
            testing: day.testing,
            overallCreditorsAmount: day.overallCreditorsAmount,
            prepaid: day.prepaid,
            pumpExpenses: day.pumpExpenses,
            personalExpenses: day.personalExpenses,
            lubricantSales: day.lubricantSales,
            transactions: day.transactions,
            machines: {
                nozzles: Array.from(day.nozzleMap.values()),
            },
            staff: Array.from(day.staffMap.values()), // ✅
        }));
        return {
            filterType,
            startDate,
            endDate,
            calculationMode,
            totalDays: dailyData.length,
            totalShifts: salesRecords.length,
            data: dailyData,
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
    __param(4, (0, mongoose_1.InjectModel)(fuel_product_schema_1.FuelProductDetails.name)),
    __param(5, (0, mongoose_1.InjectModel)(sales_schema_1.Sales.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SalesService);
