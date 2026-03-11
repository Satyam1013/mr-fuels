/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { TransactionDetails } from "../transactions/transactions.schema";
import { Machine } from "../machines/machines.schema";
import { Staff } from "../staff/staff.schema";
import { PumpDetails } from "../pump-details/pump-details.schema";
import { NonFuelProducts } from "../non-fuel-product/non-fuel-product.schema";

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

    @InjectModel(PumpDetails.name)
    private pumpDetailsModel: Model<PumpDetails>,
  ) {}

  async getDashboardSetup(adminId: string) {
    const objectAdminId = new Types.ObjectId(adminId);

    // =============================
    // 1️⃣ Machines
    // =============================
    const machines = await this.machineModel
      .find({ adminId: objectAdminId, isActive: true })
      .lean();

    // Fuel Types from Nozzles
    const fuelSet = new Set<string>();

    machines.forEach((machine) => {
      if (!Array.isArray(machine.nozzle)) return;

      machine.nozzle.forEach((n) => {
        if (n?.isActive && n?.fuelType) {
          fuelSet.add(n.fuelType.toLowerCase());
        }
      });
    });
    const fuelProducts: any = {};
    fuelSet.forEach((type) => {
      fuelProducts[type] = { liters: 0, amount: 0 };
    });

    // =============================
    // 2️⃣ Non Fuel Products (Lubricants)
    // =============================
    const nonFuelProductsData = await this.nonFuelModel.find({
      adminId: objectAdminId,
    });

    const lubricants: any = {};

    nonFuelProductsData.forEach((sales: any) => {
      const productName = sales.productName;

      if (!productName || typeof productName !== "string") return;

      lubricants[productName.toLowerCase()] = {
        liters: 0,
        amount: 0,
      };
    });

    // =============================
    // 3️⃣ Transaction Details
    // =============================
    const transaction = await this.transactionModel
      .findOne({ adminId: objectAdminId })
      .lean();

    const upiApps =
      transaction?.upiApps.map((app) => ({
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

    // =============================
    // FINAL RESPONSE
    // =============================

    return {
      overallSales: {
        fuelProducts,
        nonFuelProducts: lubricants,
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

  async getShiftDashboard(adminId: string) {
    const objectAdminId = new Types.ObjectId(adminId);

    const pumpDetails = await this.pumpDetailsModel
      .findOne({ adminId: objectAdminId })
      .lean();

    if (!pumpDetails) {
      throw new Error("Pump details not found");
    }

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // YYYY-MM-DD

    // Generate unique shift staffId from date
    const generatedShiftId = Number(
      formattedDate.replace(/-/g, "") + "01", // example: 2026030101
    );

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
}
