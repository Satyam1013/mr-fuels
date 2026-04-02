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
        const { filterType, startDate, endDate } = params;
        // Sales collection se saare records fetch karo date range me
        const salesRecords = await this.salesModel
            .find({
            adminId,
            date: { $gte: startDate, $lte: endDate },
            shiftStatus: shift_status_enum_1.ShiftStatusEnum.COMPLETED,
        })
            .lean();
        // Saare records ka data aggregate karo
        let totalOverallSalesLiters = 0;
        let totalOverallSalesAmount = 0;
        let totalNetSalesLiters = 0;
        let totalNetSalesAmount = 0;
        let totalTestingLiters = 0;
        let totalTestingAmount = 0;
        let totalCreditorsAmount = 0;
        let totalPrepaidAmount = 0;
        let totalPumpExpenses = 0;
        let totalPersonalExpenses = 0;
        let totalLubricantSales = 0;
        let totalUpi = 0;
        let totalPos = 0;
        // Nozzle wise aggregate
        const nozzleMap = new Map();
        for (const record of salesRecords) {
            totalOverallSalesLiters += record.overallSales?.liters || 0;
            totalOverallSalesAmount += record.overallSales?.amount || 0;
            totalNetSalesLiters += record.netSales?.liters || 0;
            totalNetSalesAmount += record.netSales?.amount || 0;
            totalTestingLiters += record.testing?.liters || 0;
            totalTestingAmount += record.testing?.amount || 0;
            totalCreditorsAmount += record.overallCreditorsAmount || 0;
            totalPrepaidAmount += record.prepaid || 0;
            totalPumpExpenses += record.pumpExpenses || 0;
            totalPersonalExpenses += record.personalExpenses || 0;
            totalLubricantSales += record.lubricantSales || 0;
            totalUpi += record.transactions?.upi || 0;
            totalPos += record.transactions?.pos || 0;
            const nozzles = record.machines?.nozzles || [];
            for (const nozzle of nozzles) {
                const existing = nozzleMap.get(nozzle.nozzleNumber);
                if (existing) {
                    existing.sales.liters += nozzle.sales?.liters || 0;
                    existing.sales.amount += nozzle.sales?.amount || 0;
                    existing.netSales.liters += nozzle.netSales?.liters || 0;
                    existing.netSales.amount += nozzle.netSales?.amount || 0;
                    existing.testing.liters += nozzle.testing?.liters || 0;
                    existing.testing.amount += nozzle.testing?.amount || 0;
                    existing.creditors += nozzle.creditors || 0;
                    existing.prepaid += nozzle.prepaid || 0;
                    existing.lubricantSales += nozzle.lubricantSales || 0;
                    existing.transactions.upi += nozzle.transactions?.upi || 0;
                    existing.transactions.pos += nozzle.transactions?.pos || 0;
                    existing.pumpExpenses += nozzle.pumpExpenses || 0;
                    existing.personalExpenses += nozzle.personalExpenses || 0;
                }
                else {
                    nozzleMap.set(nozzle.nozzleNumber, {
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
                        creditors: nozzle.creditors || 0,
                        prepaid: nozzle.prepaid || 0,
                        lubricantSales: nozzle.lubricantSales || 0,
                        transactions: {
                            upi: nozzle.transactions?.upi || 0,
                            pos: nozzle.transactions?.pos || 0,
                        },
                        pumpExpenses: nozzle.pumpExpenses || 0,
                        personalExpenses: nozzle.personalExpenses || 0,
                    });
                }
            }
        }
        return {
            filterType,
            startDate,
            endDate,
            totalShifts: salesRecords.length,
            overallSales: {
                liters: totalOverallSalesLiters,
                amount: totalOverallSalesAmount,
            },
            netSales: { liters: totalNetSalesLiters, amount: totalNetSalesAmount },
            testing: { liters: totalTestingLiters, amount: totalTestingAmount },
            overallCreditorsAmount: totalCreditorsAmount,
            prepaid: totalPrepaidAmount,
            pumpExpenses: totalPumpExpenses,
            personalExpenses: totalPersonalExpenses,
            lubricantSales: totalLubricantSales,
            transactions: { upi: totalUpi, pos: totalPos },
            machines: {
                overallMachineSales: {
                    liters: totalOverallSalesLiters,
                    amount: totalOverallSalesAmount,
                },
                nozzles: Array.from(nozzleMap.values()),
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
    __param(4, (0, mongoose_1.InjectModel)(fuel_product_schema_1.FuelProductDetails.name)),
    __param(5, (0, mongoose_1.InjectModel)(sales_schema_1.Sales.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SalesService);
