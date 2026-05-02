import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { TransactionDetails } from "../transactions/transactions.schema";
import { Machine } from "../machines/machines.schema";
import { Staff } from "../staff/staff.schema";
import { NonFuelProducts } from "../non-fuel-product/non-fuel-product.schema";
import {
  DailyRecord,
  GetSalesReportParams,
  MachinesSnapshot,
  NozzleLean,
  TransactionsSnapshot,
} from "./sales.enum";

import {
  FuelProductDetail,
  FuelProductDetails,
} from "../fuel-product/fuel-product.schema";
import { Sales } from "./sales.schema";
import { ShiftStatusEnum, StaffEntry } from "../shift-status/shift-status.enum";
import { CreateSaleDto, UpdateSaleDto } from "./sales.dto";

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

  async createSale(adminId: Types.ObjectId, dto: CreateSaleDto) {
    const existing = await this.salesModel.findOne({
      adminId,
      date: dto.date,
      shiftNumber: dto.shiftNumber,
    });

    if (existing) {
      throw new ConflictException(
        `Shift ${dto.shiftNumber} for date ${dto.date} already exists.`,
      );
    }

    const sale = await this.salesModel.create({
      adminId,
      ...dto,
      shiftStatus: dto.shiftStatus ?? ShiftStatusEnum.COMPLETED,
    });

    return sale;
  }

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

    const { filterType, startDate, endDate, calculationMode } = params;

    const salesRecords = await this.salesModel
      .find({
        adminId,
        date: { $gte: startDate, $lte: endDate },
        shiftStatus: ShiftStatusEnum.COMPLETED,
      })
      .sort({ date: 1, shiftNumber: 1 })
      .lean();

    if (!salesRecords.length) {
      throw new NotFoundException(
        `No sales data found for ${filterType} range ${startDate} to ${endDate}.`,
      );
    }

    // ─── SHIFTWISE ───
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
        staff: record.staff || [],
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

    // ─── DAILY CALCULATION ───
    const dailyMap = new Map<string, DailyRecord>();

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
          prepaid: {
            totalPrepaidDeposit: 0,
            prepaidCash: 0,
            prepaidPos: 0,
            prepaidUpi: 0,
            prepaidDirectAccount: 0,
          },
          pumpExpenses: 0,
          personalExpenses: 0,
          lubricantSales: 0,
          transactions: { upi: 0, pos: 0 },
          returnCreditTotals: { upi: 0, cash: 0, accountPay: 0 },
          returnCreditUpi: 0,
          returnCreditCash: 0,
          returnCreditAccountPay: 0,
          remainingDepositedAmount: 0,
          depositAmount: 0,
          additionalDepositAmount: 0,
          moneyDeposited: 0,
          inHandCash: 0,
          overallAmountGeneratedByPump: 0,
          amountReceivedToPump: 0,
          differenceSummary: {
            mainDifference: 0,
            overallShortage: 0,
            overallPumpSalesShortage: 0,
            overallShortageMoneyReceived: 0,
            overallCash: 0,
            inHandCash: 0,
            moneyDeposited: 0,
          },
          nozzleMap: new Map(),
          staffMap: new Map(),
          machineSpecificMap: new Map(),
        });
      }

      const day = dailyMap.get(key)!;

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
      day.pumpExpenses += record.pumpExpenses || 0;
      day.personalExpenses += record.personalExpenses || 0;
      day.lubricantSales += record.lubricantSales || 0;
      day.transactions.upi +=
        (record.transactions as TransactionsSnapshot)?.upi || 0;
      day.transactions.pos +=
        (record.transactions as TransactionsSnapshot)?.pos || 0;
      day.returnCreditUpi += record.returnCreditUpi || 0;
      day.returnCreditCash += record.returnCreditCash || 0;
      day.returnCreditAccountPay += record.returnCreditAccountPay || 0;
      day.remainingDepositedAmount += record.remainingDepositedAmount || 0;
      day.depositAmount += record.depositAmount || 0;
      day.additionalDepositAmount += record.additionalDepositAmount || 0;
      day.moneyDeposited += record.moneyDeposited || 0;
      day.inHandCash += record.inHandCash || 0;
      day.overallAmountGeneratedByPump +=
        record.overallAmountGeneratedByPump || 0;
      day.amountReceivedToPump += record.amountReceivedToPump || 0;

      // returnCreditTotals object
      const rct = record.returnCreditTotals as
        | { upi?: number; cash?: number; accountPay?: number }
        | undefined;
      day.returnCreditTotals.upi += rct?.upi || 0;
      day.returnCreditTotals.cash += rct?.cash || 0;
      day.returnCreditTotals.accountPay += rct?.accountPay || 0;

      const ds = record.differenceSummary as
        | {
            mainDifference?: number;
            overallShortage?: number;
            overallPumpSalesShortage?: number;
            overallShortageMoneyReceived?: number;
            overallCash?: number;
            inHandCash?: number;
            moneyDeposited?: number;
          }
        | undefined;
      day.differenceSummary.mainDifference += ds?.mainDifference || 0;
      day.differenceSummary.overallShortage += ds?.overallShortage || 0;
      day.differenceSummary.overallPumpSalesShortage +=
        ds?.overallPumpSalesShortage || 0;
      day.differenceSummary.overallShortageMoneyReceived +=
        ds?.overallShortageMoneyReceived || 0;
      day.differenceSummary.overallCash += ds?.overallCash || 0;
      day.differenceSummary.inHandCash += ds?.inHandCash || 0;
      day.differenceSummary.moneyDeposited += ds?.moneyDeposited || 0;

      // ✅ Prepaid object aggregate
      const prepaid = record.prepaid as unknown as {
        totalPrepaidDeposit?: number;
        prepaidCash?: number;
        prepaidPos?: number;
        prepaidUpi?: number;
        prepaidDirectAccount?: number;
      };
      day.prepaid.totalPrepaidDeposit += prepaid?.totalPrepaidDeposit || 0;
      day.prepaid.prepaidCash += prepaid?.prepaidCash || 0;
      day.prepaid.prepaidPos += prepaid?.prepaidPos || 0;
      day.prepaid.prepaidUpi += prepaid?.prepaidUpi || 0;
      day.prepaid.prepaidDirectAccount += prepaid?.prepaidDirectAccount || 0;

      // ─── Nozzle aggregate ───
      const nozzles =
        (record.machines as unknown as MachinesSnapshot)?.nozzles || [];
      for (const nozzle of nozzles) {
        const existing = day.nozzleMap.get(nozzle.nozzleNumber);
        if (existing) {
          existing.sales.liters += nozzle.sales?.liters || 0;
          existing.sales.amount += nozzle.sales?.amount || 0;
          existing.netSales.liters += nozzle.netSales?.liters || 0;
          existing.netSales.amount += nozzle.netSales?.amount || 0;
          existing.testing.liters += nozzle.testing?.liters || 0;
          existing.testing.amount += nozzle.testing?.amount || 0;
        } else {
          day.nozzleMap.set(nozzle.nozzleNumber, {
            nozzleNumber: nozzle.nozzleNumber,
            fuelType: nozzle.fuelType,
            staffId: nozzle.staffId,
            lastReading: nozzle.lastReading,
            currentReading: nozzle.currentReading,
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
            faultTesting: nozzle.faultTesting,
            faultDesc: nozzle.faultDesc,
            faultImg: nozzle.faultImg,
          });
        }
      }

      // ─── MachineSpecific aggregate ───
      const machineSpecificList =
        (record.machines as unknown as MachinesSnapshot)?.machineSpecific || [];
      for (const ms of machineSpecificList) {
        const msIdStr = ms.machineId?.toString();
        if (!msIdStr) continue;

        if (!day.machineSpecificMap.has(msIdStr)) {
          day.machineSpecificMap.set(msIdStr, {
            machineId: ms.machineId,
            machineName: ms.machineName,
            cashCollected: 0,
          });
        }

        const msEntry = day.machineSpecificMap.get(msIdStr)!;
        msEntry.cashCollected += ms.cashCollected || 0;
      }

      // ─── Staff aggregate ───
      const staffList = (record.staff as StaffEntry[]) || [];
      for (const staff of staffList) {
        const staffIdStr = String(staff.staffId);
        if (!staffIdStr) continue;

        if (!day.staffMap.has(staffIdStr)) {
          day.staffMap.set(staffIdStr, {
            staffId: new Types.ObjectId(staffIdStr),
            staffName: staff.staffName || "",
            machineId: staff.machineId,
            assignedNozzleNumbers: staff.assignedNozzleNumbers || [],
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
            cashCollected: 0,
          });
        }

        const staffEntry = day.staffMap.get(staffIdStr)!;
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
        staffEntry.cashCollected += staff.cashCollected || 0;
      }
    }

    // ─── dailyMap → array ───
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
      returnCreditTotals: day.returnCreditTotals,
      returnCreditUpi: day.returnCreditUpi,
      returnCreditCash: day.returnCreditCash,
      returnCreditAccountPay: day.returnCreditAccountPay,
      remainingDepositedAmount: day.remainingDepositedAmount,
      depositAmount: day.depositAmount,
      additionalDepositAmount: day.additionalDepositAmount,
      moneyDeposited: day.moneyDeposited,
      inHandCash: day.inHandCash,
      overallAmountGeneratedByPump: day.overallAmountGeneratedByPump,
      amountReceivedToPump: day.amountReceivedToPump,
      differenceSummary: day.differenceSummary,
      // ──────────────
      machines: {
        nozzles: Array.from(day.nozzleMap.values()),
        machineSpecific: Array.from(day.machineSpecificMap.values()),
      },
      staff: Array.from(day.staffMap.values()),
    }));

    // ─── DAILY → single combined object ───
    if (filterType === "daily") {
      const dayData = dailyData[0];

      if (!dayData) {
        throw new NotFoundException(
          `No sales data found for date ${startDate}.`,
        );
      }

      return {
        filterType,
        date: startDate,
        calculationMode,
        totalShifts: salesRecords.length,
        data: dayData,
      };
    }

    // ─── WEEKLY / MONTHLY / CUSTOM → array ───
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

  async updateSale(adminId: Types.ObjectId, id: string, dto: UpdateSaleDto) {
    const existing = await this.salesModel.findOne({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) {
      throw new NotFoundException(`Sale record ${id} not found.`);
    }

    const updated = await this.salesModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), adminId },
      {
        $set: {
          ...dto,
          ...(dto.shiftStatus && { shiftStatus: dto.shiftStatus }),
        },
      },
      { new: true },
    );

    return {
      message: "Sale record updated successfully",
      data: updated,
    };
  }

  async deleteSale(adminId: Types.ObjectId, id: string) {
    const deleted = await this.salesModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!deleted) {
      throw new NotFoundException(`Sale record ${id} not found.`);
    }

    return {
      message: "Sale record deleted successfully",
    };
  }
}
