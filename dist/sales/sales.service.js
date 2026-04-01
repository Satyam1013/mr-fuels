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
const machine_calculation_schema_1 = require("../machine-calculation/machine-calculation.schema");
const creditors_schema_1 = require("../creditors/creditors.schema");
const prepaid_schema_1 = require("../prepaid/prepaid.schema");
const non_fuel_product_sales_schema_1 = require("../non-fuel-product-sales/non-fuel-product-sales.schema");
const digital_payment_schema_1 = require("../digital-payment/digital-payment.schema");
const pump_expense_schema_1 = require("../pump-expense/pump-expense.schema");
const personal_expense_schema_1 = require("../personal-expense/personal-expense.schema");
const fuel_product_schema_1 = require("../fuel-product/fuel-product.schema");
let SalesService = class SalesService {
    constructor(machineModel, transactionModel, nonFuelModel, staffModel, machineCalcModel, creditorModel, prepaidModel, nonFuelSellModel, digitalPaymentModel, pumpExpenseModel, personalExpenseModel, fuelProductDetailsModel) {
        this.machineModel = machineModel;
        this.transactionModel = transactionModel;
        this.nonFuelModel = nonFuelModel;
        this.staffModel = staffModel;
        this.machineCalcModel = machineCalcModel;
        this.creditorModel = creditorModel;
        this.prepaidModel = prepaidModel;
        this.nonFuelSellModel = nonFuelSellModel;
        this.digitalPaymentModel = digitalPaymentModel;
        this.pumpExpenseModel = pumpExpenseModel;
        this.personalExpenseModel = personalExpenseModel;
        this.fuelProductDetailsModel = fuelProductDetailsModel;
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
                if (n.isActive && n.fuelProductId) {
                    const product = getProduct(n.fuelProductId);
                    if (product?.fuelType) {
                        fuelSet.add(product.fuelType.toLowerCase());
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
                    const product = getProduct(n.fuelProductId);
                    return {
                        nozzleName: `Nozzle ${index + 1}`,
                        nozzleNumber: n?.nozzleNumber || 0,
                        lastReading: 0,
                        currentReading: 0,
                        fuelType: product?.fuelType || "",
                        fuelPrice: product?.price || 0,
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
    async getDashboardData(params) {
        const { adminId, date, shiftNumber, nozzleNumber } = params;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        // ─── 1. Sab ek saath fetch karo ───
        const [machineCalculations, fuelProductDetails, digitalPayments, allCreditors, allPrepaids, allPumpExpenses, allPersonalExpenses, allNonFuelSales,] = await Promise.all([
            this.machineCalcModel
                .find({
                adminId,
                shiftNumber,
                date: { $gte: startOfDay, $lte: endOfDay },
            })
                .lean(),
            this.fuelProductDetailsModel.findOne({ adminId }).lean(),
            this.digitalPaymentModel.find({ adminId, date, shiftNumber }).lean(),
            this.creditorModel
                .find({
                adminId,
                shiftNumber,
                date: { $gte: startOfDay, $lte: endOfDay },
            })
                .lean(),
            this.prepaidModel
                .find({
                adminId,
                shiftNumber,
                date: { $gte: startOfDay, $lte: endOfDay },
            })
                .lean(),
            this.pumpExpenseModel
                .find({
                adminId,
                shiftNumber,
                date: { $gte: startOfDay, $lte: endOfDay },
            })
                .lean(),
            this.personalExpenseModel
                .find({
                adminId,
                shiftNumber,
                date: { $gte: startOfDay, $lte: endOfDay },
            })
                .lean(),
            this.nonFuelSellModel
                .find({
                adminId,
                shiftNumber,
                date: { $gte: startOfDay, $lte: endOfDay },
            })
                .lean(),
        ]);
        // ─── 2. Digital Payments totals ───
        const overallUpi = digitalPayments.reduce((sum, dp) => sum + dp.upiPayments.reduce((s, u) => s + (u.amount || 0), 0), 0);
        const overallPos = digitalPayments.reduce((sum, dp) => sum + dp.posPayments.reduce((s, p) => s + (p.amount || 0), 0), 0);
        // ─── 3. Nozzles result — creditors/prepaid se directly banao ───
        let totalOverallSalesLiters = 0;
        let totalOverallSalesAmount = 0;
        let totalTestingLiters = 0;
        let totalTestingAmount = 0;
        const allNozzlesResult = [];
        // Saare unique nozzleNumbers nikalo from creditors/prepaid/expenses
        const allNozzleNumbers = [
            ...new Set([
                ...allCreditors.map((c) => c.nozzleNumber),
                ...allPrepaids.map((p) => p.nozzleNumber),
                ...allPumpExpenses.map((e) => e.nozzleNumber),
                ...allPersonalExpenses.map((e) => e.nozzleNumber),
            ]),
        ].filter((n) => (nozzleNumber ? n === nozzleNumber : true)); // filter if nozzleNumber provided
        for (const nozzleNum of allNozzleNumbers) {
            const nozzleCreditorsAmount = allCreditors
                .filter((c) => c.nozzleNumber === nozzleNum)
                .reduce((sum, c) => sum + (c.amount || 0), 0);
            const nozzlePrepaidAmount = allPrepaids
                .filter((p) => p.nozzleNumber === nozzleNum)
                .reduce((sum, p) => sum + (p.amount || 0), 0);
            const nozzlePumpExpenses = allPumpExpenses
                .filter((e) => e.nozzleNumber === nozzleNum)
                .reduce((sum, e) => sum + (e.amount || 0), 0);
            const nozzlePersonalExpenses = allPersonalExpenses
                .filter((e) => e.nozzleNumber === nozzleNum)
                .reduce((sum, e) => sum + (e.amount || 0), 0);
            // MachineCalculation se sales nikalo agar available ho
            let overallNozzleLiters = 0;
            let overallNozzleAmount = 0;
            let testingLiters = 0;
            let testingAmount = 0;
            let netSalesLiters = 0;
            let netSalesAmount = 0;
            let nozzleUpi = 0;
            let nozzlePos = 0;
            let staffId = null;
            let fuelType = null;
            for (const machine of machineCalculations) {
                const matchedNozzle = machine.nozzles.find((n) => n.nozzleNumber === nozzleNum);
                if (matchedNozzle) {
                    const product = fuelProductDetails?.products.find((p) => p._id.toString() ===
                        matchedNozzle.fuelProductId.toString());
                    const pricePerLiter = product?.price || 0;
                    fuelType = product?.fuelType;
                    overallNozzleLiters =
                        (matchedNozzle.currentReading || 0) -
                            (matchedNozzle.lastReading || 0);
                    overallNozzleAmount = overallNozzleLiters * pricePerLiter;
                    testingLiters =
                        (matchedNozzle.testingLiters || 0) +
                            (matchedNozzle.faultTestingLiters || 0);
                    testingAmount = testingLiters * pricePerLiter;
                    netSalesLiters = overallNozzleLiters - testingLiters;
                    netSalesAmount = netSalesLiters * pricePerLiter;
                    nozzleUpi = matchedNozzle.upiAmount || 0;
                    nozzlePos = matchedNozzle.posAmount || 0;
                    staffId = matchedNozzle.staffId;
                    totalOverallSalesLiters += overallNozzleLiters;
                    totalOverallSalesAmount += overallNozzleAmount;
                    totalTestingLiters += testingLiters;
                    totalTestingAmount += testingAmount;
                }
            }
            const nozzleLubricantSales = allNonFuelSales.reduce((sum, n) => sum + (n.amount || 0), 0);
            allNozzlesResult.push({
                staffId,
                nozzleNumber: nozzleNum,
                fuelType,
                sales: { liters: overallNozzleLiters, amount: overallNozzleAmount },
                netSales: { liters: netSalesLiters, amount: netSalesAmount },
                testing: { liters: testingLiters, amount: testingAmount },
                creditors: nozzleCreditorsAmount,
                prepaid: nozzlePrepaidAmount,
                lubricantSales: nozzleLubricantSales,
                transactions: { upi: nozzleUpi, pos: nozzlePos },
                pumpExpenses: nozzlePumpExpenses,
                personalExpenses: nozzlePersonalExpenses,
            });
        }
        // ─── 4. Totals — loop se independent ───
        const totalCreditorsAmount = allCreditors.reduce((sum, c) => sum + (c.amount || 0), 0);
        const totalPrepaidAmount = allPrepaids.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalPumpExpenses = allPumpExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const totalPersonalExpenses = allPersonalExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const lubricantSalesAmount = allNonFuelSales.reduce((sum, n) => sum + (n.amount || 0), 0);
        const netSalesLiters = totalOverallSalesLiters - totalTestingLiters;
        const netSalesAmount = totalOverallSalesAmount - totalTestingAmount;
        return {
            date,
            shiftNumber,
            nozzleNumber,
            overallSales: {
                liters: totalOverallSalesLiters,
                amount: totalOverallSalesAmount,
            },
            netSales: { liters: netSalesLiters, amount: netSalesAmount },
            testing: { liters: totalTestingLiters, amount: totalTestingAmount },
            overallCreditorsAmount: totalCreditorsAmount,
            prepaid: totalPrepaidAmount,
            pumpExpenses: totalPumpExpenses,
            personalExpenses: totalPersonalExpenses,
            lubricantSales: lubricantSalesAmount,
            transactions: { upi: overallUpi, pos: overallPos },
            machines: {
                overallMachineSales: {
                    liters: totalOverallSalesLiters,
                    amount: totalOverallSalesAmount,
                },
                nozzles: allNozzlesResult,
            },
        };
    }
    async getSalesReport(params) {
        const { adminId, startDate, endDate } = params;
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        // ─── 1. Sab ek saath fetch karo ───
        const [machineCalculations, fuelProductDetails, digitalPayments, allCreditors, allPrepaids, allPumpExpenses, allPersonalExpenses, allNonFuelSales,] = await Promise.all([
            this.machineCalcModel
                .find({ adminId, date: { $gte: start, $lte: end } })
                .lean(),
            this.fuelProductDetailsModel.findOne({ adminId }).lean(),
            this.digitalPaymentModel
                .find({ adminId, date: { $gte: startDate, $lte: endDate } })
                .lean(),
            this.creditorModel
                .find({ adminId, date: { $gte: start, $lte: end } })
                .lean(),
            this.prepaidModel
                .find({ adminId, date: { $gte: start, $lte: end } })
                .lean(),
            this.pumpExpenseModel
                .find({ adminId, date: { $gte: start, $lte: end } })
                .lean(),
            this.personalExpenseModel
                .find({ adminId, date: { $gte: start, $lte: end } })
                .lean(),
            this.nonFuelSellModel
                .find({ adminId, date: { $gte: start, $lte: end } })
                .lean(),
        ]);
        // ─── 2. Digital Payments totals ───
        const overallUpi = digitalPayments.reduce((sum, dp) => sum + dp.upiPayments.reduce((s, u) => s + (u.amount || 0), 0), 0);
        const overallPos = digitalPayments.reduce((sum, dp) => sum + dp.posPayments.reduce((s, p) => s + (p.amount || 0), 0), 0);
        // ─── 3. Sales calculations ───
        let totalOverallSalesLiters = 0;
        let totalOverallSalesAmount = 0;
        let totalTestingLiters = 0;
        let totalTestingAmount = 0;
        const allNozzlesResult = [];
        const allNozzleNumbers = [
            ...new Set([
                ...allCreditors.map((c) => c.nozzleNumber),
                ...allPrepaids.map((p) => p.nozzleNumber),
                ...allPumpExpenses.map((e) => e.nozzleNumber),
                ...allPersonalExpenses.map((e) => e.nozzleNumber),
            ]),
        ];
        for (const nozzleNum of allNozzleNumbers) {
            const nozzleCreditorsAmount = allCreditors
                .filter((c) => c.nozzleNumber === nozzleNum)
                .reduce((sum, c) => sum + (c.amount || 0), 0);
            const nozzlePrepaidAmount = allPrepaids
                .filter((p) => p.nozzleNumber === nozzleNum)
                .reduce((sum, p) => sum + (p.amount || 0), 0);
            const nozzlePumpExpenses = allPumpExpenses
                .filter((e) => e.nozzleNumber === nozzleNum)
                .reduce((sum, e) => sum + (e.amount || 0), 0);
            const nozzlePersonalExpenses = allPersonalExpenses
                .filter((e) => e.nozzleNumber === nozzleNum)
                .reduce((sum, e) => sum + (e.amount || 0), 0);
            let overallNozzleLiters = 0;
            let overallNozzleAmount = 0;
            let testingLiters = 0;
            let testingAmount = 0;
            let netSalesLiters = 0;
            let netSalesAmount = 0;
            let nozzleUpi = 0;
            let nozzlePos = 0;
            let staffId = null;
            let fuelType = null;
            for (const machine of machineCalculations) {
                const matchedNozzle = machine.nozzles.find((n) => n.nozzleNumber === nozzleNum);
                if (matchedNozzle) {
                    const product = fuelProductDetails?.products.find((p) => p._id.toString() ===
                        matchedNozzle.fuelProductId.toString());
                    const pricePerLiter = product?.price || 0;
                    fuelType = product?.fuelType;
                    const nozzleLiters = (matchedNozzle.currentReading || 0) -
                        (matchedNozzle.lastReading || 0);
                    const nozzleTestingLiters = (matchedNozzle.testingLiters || 0) +
                        (matchedNozzle.faultTestingLiters || 0);
                    overallNozzleLiters += nozzleLiters;
                    overallNozzleAmount += nozzleLiters * pricePerLiter;
                    testingLiters += nozzleTestingLiters;
                    testingAmount += nozzleTestingLiters * pricePerLiter;
                    netSalesLiters += nozzleLiters - nozzleTestingLiters;
                    netSalesAmount +=
                        (nozzleLiters - nozzleTestingLiters) * pricePerLiter;
                    nozzleUpi += matchedNozzle.upiAmount || 0;
                    nozzlePos += matchedNozzle.posAmount || 0;
                    staffId = matchedNozzle.staffId;
                    totalOverallSalesLiters += nozzleLiters;
                    totalOverallSalesAmount += nozzleLiters * pricePerLiter;
                    totalTestingLiters += nozzleTestingLiters;
                    totalTestingAmount += nozzleTestingLiters * pricePerLiter;
                }
            }
            const nozzleLubricantSales = allNonFuelSales.reduce((sum, n) => sum + (n.amount || 0), 0);
            allNozzlesResult.push({
                staffId,
                nozzleNumber: nozzleNum,
                fuelType,
                sales: { liters: overallNozzleLiters, amount: overallNozzleAmount },
                netSales: { liters: netSalesLiters, amount: netSalesAmount },
                testing: { liters: testingLiters, amount: testingAmount },
                creditors: nozzleCreditorsAmount,
                prepaid: nozzlePrepaidAmount,
                lubricantSales: nozzleLubricantSales,
                transactions: { upi: nozzleUpi, pos: nozzlePos },
                pumpExpenses: nozzlePumpExpenses,
                personalExpenses: nozzlePersonalExpenses,
            });
        }
        // ─── 4. Totals ───
        const totalCreditorsAmount = allCreditors.reduce((sum, c) => sum + (c.amount || 0), 0);
        const totalPrepaidAmount = allPrepaids.reduce((sum, p) => sum + (p.amount || 0), 0);
        const totalPumpExpenses = allPumpExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const totalPersonalExpenses = allPersonalExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
        const lubricantSalesAmount = allNonFuelSales.reduce((sum, n) => sum + (n.amount || 0), 0);
        const netSalesLiters = totalOverallSalesLiters - totalTestingLiters;
        const netSalesAmount = totalOverallSalesAmount - totalTestingAmount;
        return {
            filterType: params.filterType,
            startDate,
            endDate,
            overallSales: {
                liters: totalOverallSalesLiters,
                amount: totalOverallSalesAmount,
            },
            netSales: { liters: netSalesLiters, amount: netSalesAmount },
            testing: { liters: totalTestingLiters, amount: totalTestingAmount },
            overallCreditorsAmount: totalCreditorsAmount,
            prepaid: totalPrepaidAmount,
            pumpExpenses: totalPumpExpenses,
            personalExpenses: totalPersonalExpenses,
            lubricantSales: lubricantSalesAmount,
            transactions: { upi: overallUpi, pos: overallPos },
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
    __param(4, (0, mongoose_1.InjectModel)(machine_calculation_schema_1.MachineCalculation.name)),
    __param(5, (0, mongoose_1.InjectModel)(creditors_schema_1.Creditor.name)),
    __param(6, (0, mongoose_1.InjectModel)(prepaid_schema_1.Prepaid.name)),
    __param(7, (0, mongoose_1.InjectModel)(non_fuel_product_sales_schema_1.NonFuelSellProduct.name)),
    __param(8, (0, mongoose_1.InjectModel)(digital_payment_schema_1.DigitalPayment.name)),
    __param(9, (0, mongoose_1.InjectModel)(pump_expense_schema_1.PumpExpense.name)),
    __param(10, (0, mongoose_1.InjectModel)(personal_expense_schema_1.PersonalExpense.name)),
    __param(11, (0, mongoose_1.InjectModel)(fuel_product_schema_1.FuelProductDetails.name)),
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
