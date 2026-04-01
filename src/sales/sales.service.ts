import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { TransactionDetails } from "../transactions/transactions.schema";
import { Machine } from "../machines/machines.schema";
import { Staff } from "../staff/staff.schema";
import { NonFuelProducts } from "../non-fuel-product/non-fuel-product.schema";
import {
  GetDashboardDataParams,
  GetSalesReportParams,
  NozzleLean,
} from "./sales.enum";
import { MachineCalculation } from "../machine-calculation/machine-calculation.schema";
import { Creditor } from "../creditors/creditors.schema";
import { Prepaid } from "../prepaid/prepaid.schema";
import { NonFuelSellProduct } from "../non-fuel-product-sales/non-fuel-product-sales.schema";
import { DigitalPayment } from "../digital-payment/digital-payment.schema";
import { PumpExpense } from "../pump-expense/pump-expense.schema";
import { PersonalExpense } from "../personal-expense/personal-expense.schema";
import {
  FuelProductDetail,
  FuelProductDetails,
} from "../fuel-product/fuel-product.schema";
import { Sales } from "./sales.schema";

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Machine.name)
    private machineModel: Model<Machine>,

    @InjectModel(TransactionDetails.name)
    private transactionModel: Model<TransactionDetails>,

    @InjectModel(NonFuelProducts.name)
    private nonFuelModel: Model<NonFuelProducts>,

    @InjectModel(Staff.name)
    private staffModel: Model<Staff>,

    @InjectModel(MachineCalculation.name)
    private machineCalcModel: Model<MachineCalculation>,

    @InjectModel(Creditor.name)
    private creditorModel: Model<Creditor>,

    @InjectModel(Prepaid.name)
    private prepaidModel: Model<Prepaid>,

    @InjectModel(NonFuelSellProduct.name)
    private nonFuelSellModel: Model<NonFuelSellProduct>,

    @InjectModel(DigitalPayment.name)
    private digitalPaymentModel: Model<DigitalPayment>,

    @InjectModel(PumpExpense.name)
    private pumpExpenseModel: Model<PumpExpense>,

    @InjectModel(PersonalExpense.name)
    private personalExpenseModel: Model<PersonalExpense>,

    @InjectModel(FuelProductDetails.name)
    private fuelProductDetailsModel: Model<FuelProductDetails>,

    @InjectModel(Sales.name)
    private salesModel: Model<Sales>,
  ) {}

  async getDashboardSetup(adminId: Types.ObjectId) {
    // =============================
    // 1️⃣ Machines + FuelProductDetails
    // =============================
    const [machines, fuelProductDetails] = await Promise.all([
      this.machineModel.find({ adminId, isActive: true }).lean(),
      this.fuelProductDetailsModel.findOne({ adminId }).lean(),
    ]);

    // Helper — fuelProductId se product nikalo
    const getProduct = (fuelProductId: Types.ObjectId) =>
      fuelProductDetails?.products.find(
        (p) =>
          (p as FuelProductDetail)._id.toString() === fuelProductId.toString(),
      );

    // Fuel Types from Nozzles
    const fuelSet = new Set<string>();

    machines.forEach((machine) => {
      if (!Array.isArray(machine.nozzle)) return;
      (machine.nozzle as NozzleLean[]).forEach((n) => {
        if (n.isActive) {
          const product = n.fuelProductId ? getProduct(n.fuelProductId) : null;
          const fuelType = product?.fuelType || n.fuelType;
          if (fuelType) {
            fuelSet.add(fuelType.toLowerCase());
          }
        }
      });
    });

    const fuelProducts: Record<string, { liters: number; amount: number }> = {};
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

    const upiApps =
      transaction?.upiApps.map((app) => ({
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
        ? (machine.nozzle as NozzleLean[]).map((n, index) => {
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

  async getDashboardData(params: {
    adminId: Types.ObjectId;
    date: string;
    shiftNumber: number;
  }) {
    const record = await this.salesModel
      .findOne({
        adminId: params.adminId,
        date: params.date,
        shiftNumber: params.shiftNumber,
      })
      .lean();

    if (!record) {
      throw new NotFoundException(
        `No sales data found for date ${params.date} shift ${params.shiftNumber}. Shift may not be closed yet.`,
      );
    }

    return record;
  }

  async calculateDashboardData(params: GetDashboardDataParams) {
    const { adminId, date, shiftNumber, nozzleNumber } = params;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // ─── 1. Sab ek saath fetch karo ───
    const [
      machineCalculations,
      fuelProductDetails,
      digitalPayments,
      allCreditors,
      allPrepaids,
      allPumpExpenses,
      allPersonalExpenses,
      allNonFuelSales,
    ] = await Promise.all([
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
    const overallUpi = digitalPayments.reduce(
      (sum, dp) =>
        sum + dp.upiPayments.reduce((s, u) => s + (u.amount || 0), 0),
      0,
    );
    const overallPos = digitalPayments.reduce(
      (sum, dp) =>
        sum + dp.posPayments.reduce((s, p) => s + (p.amount || 0), 0),
      0,
    );

    // ─── 3. Nozzles result — creditors/prepaid se directly banao ───

    let totalOverallSalesLiters = 0;
    let totalOverallSalesAmount = 0;
    let totalTestingLiters = 0;
    let totalTestingAmount = 0;

    const allNozzlesResult: any[] = [];

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
        const matchedNozzle = machine.nozzles.find(
          (n) => n.nozzleNumber === nozzleNum,
        );
        if (matchedNozzle) {
          const product = fuelProductDetails?.products.find(
            (p) =>
              (p as FuelProductDetail)._id.toString() ===
              matchedNozzle.fuelProductId.toString(),
          );
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

      const nozzleLubricantSales = allNonFuelSales.reduce(
        (sum, n) => sum + (n.amount || 0),
        0,
      );

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
    const totalCreditorsAmount = allCreditors.reduce(
      (sum, c) => sum + (c.amount || 0),
      0,
    );
    const totalPrepaidAmount = allPrepaids.reduce(
      (sum, p) => sum + (p.amount || 0),
      0,
    );
    const totalPumpExpenses = allPumpExpenses.reduce(
      (sum, e) => sum + (e.amount || 0),
      0,
    );
    const totalPersonalExpenses = allPersonalExpenses.reduce(
      (sum, e) => sum + (e.amount || 0),
      0,
    );
    const lubricantSalesAmount = allNonFuelSales.reduce(
      (sum, n) => sum + (n.amount || 0),
      0,
    );

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

  async getSalesReport(params: GetSalesReportParams) {
    const { adminId, startDate, endDate } = params;

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // ─── 1. Sab ek saath fetch karo ───
    const [
      machineCalculations,
      fuelProductDetails,
      digitalPayments,
      allCreditors,
      allPrepaids,
      allPumpExpenses,
      allPersonalExpenses,
      allNonFuelSales,
    ] = await Promise.all([
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
    const overallUpi = digitalPayments.reduce(
      (sum, dp) =>
        sum + dp.upiPayments.reduce((s, u) => s + (u.amount || 0), 0),
      0,
    );
    const overallPos = digitalPayments.reduce(
      (sum, dp) =>
        sum + dp.posPayments.reduce((s, p) => s + (p.amount || 0), 0),
      0,
    );

    // ─── 3. Sales calculations ───
    let totalOverallSalesLiters = 0;
    let totalOverallSalesAmount = 0;
    let totalTestingLiters = 0;
    let totalTestingAmount = 0;

    const allNozzlesResult: any[] = [];

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
        const matchedNozzle = machine.nozzles.find(
          (n) => n.nozzleNumber === nozzleNum,
        );
        if (matchedNozzle) {
          const product = fuelProductDetails?.products.find(
            (p) =>
              (p as FuelProductDetail)._id.toString() ===
              matchedNozzle.fuelProductId.toString(),
          );
          const pricePerLiter = product?.price || 0;
          fuelType = product?.fuelType;

          const nozzleLiters =
            (matchedNozzle.currentReading || 0) -
            (matchedNozzle.lastReading || 0);
          const nozzleTestingLiters =
            (matchedNozzle.testingLiters || 0) +
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

      const nozzleLubricantSales = allNonFuelSales.reduce(
        (sum, n) => sum + (n.amount || 0),
        0,
      );

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
    const totalCreditorsAmount = allCreditors.reduce(
      (sum, c) => sum + (c.amount || 0),
      0,
    );
    const totalPrepaidAmount = allPrepaids.reduce(
      (sum, p) => sum + (p.amount || 0),
      0,
    );
    const totalPumpExpenses = allPumpExpenses.reduce(
      (sum, e) => sum + (e.amount || 0),
      0,
    );
    const totalPersonalExpenses = allPersonalExpenses.reduce(
      (sum, e) => sum + (e.amount || 0),
      0,
    );
    const lubricantSalesAmount = allNonFuelSales.reduce(
      (sum, n) => sum + (n.amount || 0),
      0,
    );

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
}
