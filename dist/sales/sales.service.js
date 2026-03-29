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
const pump_details_schema_1 = require("../pump-details/pump-details.schema");
const non_fuel_product_schema_1 = require("../non-fuel-product/non-fuel-product.schema");
const machine_calculation_schema_1 = require("../machine-calculation/machine-calculation.schema");
const creditors_schema_1 = require("../creditors/creditors.schema");
const prepaid_schema_1 = require("../prepaid/prepaid.schema");
const non_fuel_product_sales_schema_1 = require("../non-fuel-product-sales/non-fuel-product-sales.schema");
const digital_payment_schema_1 = require("../digital-payment/digital-payment.schema");
const pump_expense_schema_1 = require("../pump-expense/pump-expense.schema");
const personal_expense_schema_1 = require("../personal-expense/personal-expense.schema");
let SalesService = class SalesService {
    constructor(machineModel, transactionModel, nonFuelModel, staffModel, pumpDetailsModel, machineCalcModel, creditorModel, prepaidModel, nonFuelSellModel, digitalPaymentModel, pumpExpenseModel, personalExpenseModel) {
        this.machineModel = machineModel;
        this.transactionModel = transactionModel;
        this.nonFuelModel = nonFuelModel;
        this.staffModel = staffModel;
        this.pumpDetailsModel = pumpDetailsModel;
        this.machineCalcModel = machineCalcModel;
        this.creditorModel = creditorModel;
        this.prepaidModel = prepaidModel;
        this.nonFuelSellModel = nonFuelSellModel;
        this.digitalPaymentModel = digitalPaymentModel;
        this.pumpExpenseModel = pumpExpenseModel;
        this.personalExpenseModel = personalExpenseModel;
    }
    async getDashboardSetup(adminId) {
        // =============================
        // 1️⃣ Machines
        // =============================
        const machines = await this.machineModel
            .find({ adminId, isActive: true })
            .lean()
            .exec();
        // Fuel Types from Nozzles
        const fuelSet = new Set();
        machines.forEach((machine) => {
            if (!Array.isArray(machine.nozzle))
                return;
            machine.nozzle.forEach((n) => {
                if (n.isActive && n.fuelType) {
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
    async getDashboardData(params) {
        const { adminId, date, shiftNumber, shiftId } = params;
        // Date range: us din ka start aur end (00:00:00 to 23:59:59)
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        // ─── 1. Saari MachineCalculations fetch karo (us din + shift) ───
        const machineCalculations = await this.machineCalcModel
            .find({
            adminId,
            shiftNumber,
            date: { $gte: startOfDay, $lte: endOfDay },
        })
            .lean();
        // ─── 2. Digital Payments (overall UPI + POS) ───
        const digitalPayments = await this.digitalPaymentModel
            .find({
            adminId,
            date, // DigitalPayment me date string hai schema ke hisab se
            shiftNumber,
        })
            .lean();
        const overallUpi = digitalPayments.reduce((sum, dp) => sum + dp.upiPayments.reduce((s, u) => s + (u.amount || 0), 0), 0);
        const overallPos = digitalPayments.reduce((sum, dp) => sum + dp.posPayments.reduce((s, p) => s + (p.amount || 0), 0), 0);
        // ─── 3. Har machine ke nozzles process karo ───
        let totalOverallSalesLiters = 0;
        let totalOverallSalesAmount = 0;
        let totalTestingLiters = 0;
        let totalTestingAmount = 0;
        let totalCreditorsAmount = 0;
        let totalPrepaidAmount = 0;
        let totalPumpExpenses = 0;
        let totalPersonalExpenses = 0;
        const allNozzlesResult = [];
        for (const machine of machineCalculations) {
            const machineId = machine.machineId;
            // Nozzle-level data
            for (const nozzle of machine.nozzles) {
                const nozzleNumber = nozzle.nozzleNumber;
                // ── Sales calculation ──
                const salesLiters = (nozzle.currentReading || 0) -
                    (nozzle.lastReading || 0) -
                    (nozzle.testingLiters || 0) -
                    (nozzle.faultTestingLiters || 0);
                const overallNozzleLiters = (nozzle.currentReading || 0) - (nozzle.lastReading || 0);
                const overallNozzleAmount = overallNozzleLiters * (nozzle.pricePerLiter || 0);
                const testingLiters = (nozzle.testingLiters || 0) + (nozzle.faultTestingLiters || 0);
                const testingAmount = testingLiters * (nozzle.pricePerLiter || 0);
                const netSalesLiters = overallNozzleLiters - testingLiters;
                const netSalesAmount = netSalesLiters * (nozzle.pricePerLiter || 0);
                // ── Creditors ──
                const creditors = await this.creditorModel
                    .find({
                    adminId,
                    machineId,
                    shiftNumber,
                    nozzleNumber,
                    date: { $gte: startOfDay, $lte: endOfDay },
                })
                    .lean();
                const creditorsAmount = creditors.reduce((sum, c) => sum + (c.amount || 0), 0);
                // ── Prepaid ──
                const prepaids = await this.prepaidModel
                    .find({
                    adminId,
                    machineId,
                    shiftNumber,
                    nozzleNumber,
                    date: { $gte: startOfDay, $lte: endOfDay },
                })
                    .lean();
                const prepaidAmount = prepaids.reduce((sum, p) => sum + (p.amount || 0), 0);
                // ── Pump Expenses ──
                const pumpExpenses = await this.pumpExpenseModel
                    .find({
                    adminId,
                    machineId,
                    shiftNumber,
                    nozzleNumber,
                    date: { $gte: startOfDay, $lte: endOfDay },
                })
                    .lean();
                const pumpExpensesAmount = pumpExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
                // ── Personal Expenses ──
                const personalExpenses = await this.personalExpenseModel
                    .find({
                    adminId,
                    machineId,
                    shiftNumber,
                    nozzleNumber,
                    date: { $gte: startOfDay, $lte: endOfDay },
                })
                    .lean();
                const personalExpensesAmount = personalExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
                // ── Lubricant (NonFuel) Sales — nozzle level nahi, machine level hai ──
                // (neeche machine level pe fetch karenge, yahan 0 rakhenge)
                // ── Nozzle UPI/POS ──
                const nozzleUpi = nozzle.upiAmount || 0;
                const nozzlePos = nozzle.posAmount || 0;
                // Totals update
                totalOverallSalesLiters += overallNozzleLiters;
                totalOverallSalesAmount += overallNozzleAmount;
                totalTestingLiters += testingLiters;
                totalTestingAmount += testingAmount;
                totalCreditorsAmount += creditorsAmount;
                totalPrepaidAmount += prepaidAmount;
                totalPumpExpenses += pumpExpensesAmount;
                totalPersonalExpenses += personalExpensesAmount;
                allNozzlesResult.push({
                    staffId: nozzle.staffId,
                    nozzleNumber,
                    sales: {
                        liters: overallNozzleLiters,
                        amount: overallNozzleAmount,
                    },
                    netSales: {
                        liters: netSalesLiters,
                        amount: netSalesAmount,
                    },
                    testing: {
                        liters: testingLiters,
                        amount: testingAmount,
                    },
                    creditors: creditorsAmount,
                    prepaid: prepaidAmount,
                    transactions: {
                        upi: nozzleUpi,
                        pos: nozzlePos,
                    },
                    pumpExpenses: pumpExpensesAmount,
                    personalExpenses: personalExpensesAmount,
                });
            }
            // ── Lubricant (NonFuel) — machine level per shift ──
            const nonFuelSales = await this.nonFuelSellModel
                .find({
                adminId,
                machineId,
                shiftNumber,
                date: { $gte: startOfDay, $lte: endOfDay },
            })
                .lean();
            const lubricantSalesAmount = nonFuelSales.reduce((sum, n) => sum + (n.amount || 0), 0);
            // Lubricant amount nozzle result me add karo (machine ke saare nozzles me distribute — ya machine level pe rakh sakte ho)
            // Simple approach: machine ke pehle nozzle pe daal do, ya top-level me dikha do
            // Yahan hum isko overall response me alag se dikhayenge
        }
        // ── Staff name populate (optional) ──
        // Agar staffId se name chahiye to Staff model se lookup karo
        // ─── Final Response ───
        const netSalesLiters = totalOverallSalesLiters - totalTestingLiters;
        const netSalesAmount = totalOverallSalesAmount - totalTestingAmount;
        return {
            date,
            shiftNumber,
            shiftId,
            overallSales: {
                liters: totalOverallSalesLiters,
                amount: totalOverallSalesAmount,
            },
            netSales: {
                liters: netSalesLiters,
                amount: netSalesAmount,
            },
            testing: {
                liters: totalTestingLiters,
                amount: totalTestingAmount,
            },
            overallCreditorsAmount: totalCreditorsAmount,
            prepaid: totalPrepaidAmount,
            pumpExpenses: totalPumpExpenses,
            personalExpenses: totalPersonalExpenses,
            transactions: {
                upi: overallUpi,
                pos: overallPos,
            },
            machines: {
                overallMachineSales: {
                    liters: totalOverallSalesLiters,
                    amount: totalOverallSalesAmount,
                },
                nozzles: allNozzlesResult,
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
    __param(5, (0, mongoose_1.InjectModel)(machine_calculation_schema_1.MachineCalculation.name)),
    __param(6, (0, mongoose_1.InjectModel)(creditors_schema_1.Creditor.name)),
    __param(7, (0, mongoose_1.InjectModel)(prepaid_schema_1.Prepaid.name)),
    __param(8, (0, mongoose_1.InjectModel)(non_fuel_product_sales_schema_1.NonFuelSellProduct.name)),
    __param(9, (0, mongoose_1.InjectModel)(digital_payment_schema_1.DigitalPayment.name)),
    __param(10, (0, mongoose_1.InjectModel)(pump_expense_schema_1.PumpExpense.name)),
    __param(11, (0, mongoose_1.InjectModel)(personal_expense_schema_1.PersonalExpense.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SalesService);
