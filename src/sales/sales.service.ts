import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { TransactionDetails } from "../transactions/transactions.schema";
import { Machine } from "../machines/machines.schema";
import { Staff } from "../staff/staff.schema";
import { NonFuelProducts } from "../non-fuel-product/non-fuel-product.schema";
import {
  GetSalesReportParams,
  MachinesSnapshot,
  NozzleLean,
  NozzleSnapshot,
  TransactionsSnapshot,
} from "./sales.enum";

import {
  FuelProductDetail,
  FuelProductDetails,
} from "../fuel-product/fuel-product.schema";
import { Sales } from "./sales.schema";
import { ShiftStatusEnum } from "../shift-status/shift-status.enum";

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

  async getSalesReport(params: GetSalesReportParams) {
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
        throw new NotFoundException(
          `No sales data found for date ${params.date} shift ${params.shiftNumber}. Shift may not be closed yet.`,
        );
      }

      return record;
    }

    const { filterType, startDate, endDate } = params;

    // Sales collection se saare records fetch karo date range me
    const salesRecords = await this.salesModel
      .find({
        adminId,
        date: { $gte: startDate, $lte: endDate },
        shiftStatus: ShiftStatusEnum.COMPLETED,
      })
      .lean();

    if (!salesRecords.length) {
      throw new NotFoundException(
        `No sales data found for ${filterType} range ${startDate} to ${endDate}.`,
      );
    }

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
    const nozzleMap = new Map<number, any>();

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
      totalUpi += (record.transactions as TransactionsSnapshot)?.upi || 0;
      totalPos += (record.transactions as TransactionsSnapshot)?.pos || 0;

      const nozzles = (record.machines as MachinesSnapshot)?.nozzles || [];

      for (const nozzle of nozzles) {
        const existing = nozzleMap.get(nozzle.nozzleNumber) as
          | NozzleSnapshot
          | undefined;

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
        } else {
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
          } as NozzleSnapshot);
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
}
