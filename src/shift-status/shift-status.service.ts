import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, UpdateQuery } from "mongoose";
import { ShiftStatus } from "./shift-status.schema";
import { CreateShiftStatusDto } from "./shift-status.dto";
import { PumpDetails } from "../pump-details/pump-details.schema";
import { PumpStatusEnum, ShiftStatusEnum } from "./shift-status.enum";
import {
  PopulatedShift,
  PumpDetailsLean,
  ShiftStatusPopulated,
} from "./shift-status.types";
import { AuthUser, Role } from "../admin/admin.enum";
import { Manager } from "../managers/managers.schema";
import { Admin } from "../admin/admin.schema";
import { Sales } from "../sales/sales.schema";
import { MachineCalculation } from "../machine-calculation/machine-calculation.schema";
import { Creditor } from "../creditors/creditors.schema";
import { Prepaid } from "../prepaid/prepaid.schema";
import { NonFuelSellProduct } from "../non-fuel-product-sales/non-fuel-product-sales.schema";
import { DigitalPayment } from "../digital-payment/digital-payment.schema";
import { PumpExpense } from "../pump-expense/pump-expense.schema";
import { PersonalExpense } from "../personal-expense/personal-expense.schema";
import { GetDashboardDataParams } from "../sales/sales.enum";
import {
  FuelProductDetail,
  FuelProductDetails,
} from "../fuel-product/fuel-product.schema";

@Injectable()
export class ShiftStatusService {
  constructor(
    @InjectModel(ShiftStatus.name)
    private shiftStatusModel: Model<ShiftStatus>,

    @InjectModel(PumpDetails.name)
    private pumpDetailsModel: Model<PumpDetails>,

    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,

    @InjectModel(Manager.name)
    private managerModel: Model<Manager>,

    @InjectModel(Sales.name)
    private salesModel: Model<Sales>,

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
  ) {}

  private getRoleModel(role: string): Role {
    switch (role.toLowerCase()) {
      case "admin":
        return Role.ADMIN;
      case "manager":
        return Role.MANAGER;
      default:
        return Role.MANAGER;
    }
  }

  private buildTemplate(
    pumpDetails: PumpDetailsLean,
    date: string,
    shiftId: number,
  ) {
    return {
      date,
      totalShifts: pumpDetails.numberOfShifts,

      currentShift: {
        shiftId: 1,
        staffId: shiftId,
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

      dailyClose: false,
      pumpStatus: "open",
    };
  }

  async calculateDashboardData(params: GetDashboardDataParams) {
    const { adminId, date, shiftNumber, nozzleNumber } = params;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

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
      this.digitalPaymentModel
        .find({
          adminId,
          shiftNumber,
          date,
        })
        .lean(),
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

    // ─── Digital Payments totals ───
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

    let totalOverallSalesLiters = 0;
    let totalOverallSalesAmount = 0;
    let totalTestingLiters = 0;
    let totalTestingAmount = 0;

    const allNozzlesResult: any[] = [];

    // ✅ Bug 2 Fix — nozzle numbers machine calculations SE nikalo
    // creditors/prepaid empty hone pe bhi loop chalega
    const machineNozzleNumbers = [
      ...new Set(
        machineCalculations.flatMap((m) =>
          m.nozzles.map((n) => n.nozzleNumber),
        ),
      ),
    ];

    const otherNozzleNumbers = [
      ...new Set([
        ...allCreditors.map((c) => c.nozzleNumber),
        ...allPrepaids.map((p) => p.nozzleNumber),
        ...allPumpExpenses.map((e) => e.nozzleNumber),
        ...allPersonalExpenses.map((e) => e.nozzleNumber),
      ]),
    ];

    // ✅ Dono sources merge karo — koi nozzle miss na ho
    const allNozzleNumbers = [
      ...new Set([...machineNozzleNumbers, ...otherNozzleNumbers]),
    ].filter((n) => (nozzleNumber ? n === nozzleNumber : true));

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

    // ─── Totals ───
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

  async getByDate(adminId: Types.ObjectId, date: string) {
    const pumpDetails = await this.pumpDetailsModel.findOne({ adminId }).lean();

    if (!pumpDetails) {
      throw new Error("Pump details not found");
    }

    const today = new Date().toISOString().split("T")[0];
    const requestedDate = date || today;

    const formattedNumberDate = Number(requestedDate.replace(/-/g, "") + "01");

    const reqDateObj = new Date(requestedDate);
    const todayObj = new Date(today);

    // ---------------- HELPERS ----------------
    const fetchClosedByInfo = async (id: Types.ObjectId | string | null) => {
      if (!id) return null;

      // 1️⃣ Check in Admins
      const admin = await this.adminModel
        .findById(id)
        .select("businessName email role")
        .lean();

      if (admin)
        return {
          id: admin._id,
          name: admin.businessName || "",
          email: admin.email || "",
          role: admin.role,
        };

      // 2️⃣ Check in Managers
      const manager = await this.managerModel
        .findById(id)
        .select("managerName phone role")
        .lean();

      if (manager)
        return {
          id: manager._id,
          name: manager.managerName || "",
          email: manager.phone || "",
          role: manager.role,
        };

      return null;
    };

    const mapClosedBy = async (shift: PopulatedShift) => {
      if (!shift?.closedBy) return null;

      // ✅ Fix: ObjectId instance check — directly fetch karo
      if (shift.closedBy instanceof Types.ObjectId) {
        return fetchClosedByInfo(shift.closedBy);
      }

      // ✅ Populated object — actual fields exist check karo
      if (
        typeof shift.closedBy === "object" &&
        "_id" in shift.closedBy &&
        ("name" in shift.closedBy || "managerName" in shift.closedBy)
      ) {
        const populated = shift.closedBy as {
          _id: Types.ObjectId;
          name?: string;
          email?: string;
        };
        return {
          id: populated._id?.toString() || null,
          name: populated.name || "",
          email: populated.email || "",
          role: shift.closedByModel,
        };
      }

      return fetchClosedByInfo(shift.closedBy as Types.ObjectId);
    };

    const mapResponse = async (data: ShiftStatusPopulated) => {
      const completedShifts = data.shifts.filter(
        (s) => s.status === ShiftStatusEnum.COMPLETED,
      ).length;

      const totalShifts = pumpDetails.numberOfShifts || 0;
      const pendingShifts = totalShifts - completedShifts;
      const percent =
        totalShifts > 0 ? (completedShifts / totalShifts) * 100 : 0;

      // Map shifts with closedBy info
      const shiftsWithClosedBy = [];
      for (const s of data.shifts || []) {
        shiftsWithClosedBy.push({
          ...s,
          closedBy: await mapClosedBy(s),
        });
      }

      const currentShiftWithClosedBy = data.currentShift
        ? {
            ...data.currentShift,
            closedBy: await mapClosedBy(data.currentShift),
          }
        : null;

      return {
        _id: data._id?.toString(),
        date: data.date,
        totalShifts,
        currentShift: currentShiftWithClosedBy,
        shifts: shiftsWithClosedBy,
        dailyProgress: {
          completedShifts,
          pendingShifts,
          overallCompletionPercent: percent,
        },
        dailyClose: data.dailyClose,
        pumpStatus: data.pumpStatus,
      };
    };

    // ----------- EXACT DATA -----------
    const exact = await this.shiftStatusModel
      .findOne({ adminId, date: requestedDate })
      .lean<ShiftStatusPopulated>();

    if (exact) {
      return mapResponse(exact);
    }

    // ----------- LATEST RECORD -----------
    const latest = await this.shiftStatusModel
      .findOne({ adminId })
      .sort({ date: -1 })
      .lean<ShiftStatusPopulated>();

    if (!latest) {
      return this.buildTemplate(
        pumpDetails,
        requestedDate,
        formattedNumberDate,
      );
    }

    const latestDateObj = new Date(latest.date);

    // ----------- FIRST RECORD -----------
    const first = await this.shiftStatusModel
      .findOne({ adminId })
      .sort({ date: 1 })
      .lean();

    if (!first) {
      return this.buildTemplate(
        pumpDetails,
        requestedDate,
        formattedNumberDate,
      );
    }

    const firstDateObj = new Date(first.date);

    if (reqDateObj < firstDateObj) {
      return {
        message:
          "Selected date does not come in range, please try after the first registered date",
        firstRegisteredDate: first.date,
      };
    }

    // ----------- PREVIOUS UNFINISHED -----------
    // Agar latest record ka dailyClose nahi hua aur requested date usse aage hai
    if (!latest.dailyClose && reqDateObj > latestDateObj) {
      return {
        ...(await mapResponse(latest)),
        requestedDate,
        reason: "previous_unfinished_day",
      };
    }

    // ----------- NO DATA FOR PAST / TODAY -----------
    if (reqDateObj <= todayObj) {
      // ✅ Agar latest record closed hai aur requested date usse aage hai
      // → Check karo ki koi gap hai ya nahi
      if (latest.dailyClose && reqDateObj > latestDateObj) {
        // Next consecutive day calculate karo latest closed record ke baad
        const dayAfterLatest = new Date(latestDateObj);
        dayAfterLatest.setDate(dayAfterLatest.getDate() + 1);
        dayAfterLatest.setHours(0, 0, 0, 0);

        const reqNormalized = new Date(reqDateObj);
        reqNormalized.setHours(0, 0, 0, 0);

        if (reqNormalized.getTime() === dayAfterLatest.getTime()) {
          // ✅ No gap — bilkul agla din hai, fresh template return karo
          return this.buildTemplate(
            pumpDetails,
            requestedDate,
            formattedNumberDate,
          );
        }

        // ❌ Gap hai — beech ki dates missing hain
        return {
          message: "No data available for this date",
          date: requestedDate,
        };
      }

      // Requested date latest se pehle hai ya same hai but exact record nahi mila
      return {
        message: "No data available for this date",
        date: requestedDate,
      };
    }

    // ----------- FUTURE TEMPLATE -----------
    return this.buildTemplate(pumpDetails, requestedDate, formattedNumberDate);
  }

  async create(user: AuthUser, dto: CreateShiftStatusDto) {
    const adminId = new Types.ObjectId(user.adminId ?? user._id);

    const existing = await this.shiftStatusModel.findOne({
      adminId,
      date: dto.date,
    });

    if (existing) {
      throw new BadRequestException(
        "Shift status already created for this date",
      );
    }

    const now = new Date().toISOString();

    const shifts = dto.shifts.map((shift) => ({
      ...shift,
      ...(shift.status === ShiftStatusEnum.COMPLETED && {
        closedBy: new Types.ObjectId(user.adminId ?? user._id),
        closedByModel: this.getRoleModel(user.role),
        endTime: shift.endTime ?? now,
      }),
    }));

    // ── Completed shifts ke liye sales save karo ──
    for (const shift of shifts) {
      if (shift.status === ShiftStatusEnum.COMPLETED) {
        const dashboardData = await this.calculateDashboardData({
          adminId,
          date: dto.date,
          shiftNumber: shift.shiftNumber,
        });

        await this.salesModel.findOneAndUpdate(
          {
            adminId,
            date: dto.date,
            shiftNumber: shift.shiftNumber,
          },
          {
            adminId,
            date: dto.date,
            shiftNumber: shift.shiftNumber,
            shiftStatus: ShiftStatusEnum.COMPLETED,
            overallSales: dashboardData.overallSales,
            netSales: dashboardData.netSales,
            testing: dashboardData.testing,
            overallCreditorsAmount: dashboardData.overallCreditorsAmount,
            prepaid: dashboardData.prepaid,
            pumpExpenses: dashboardData.pumpExpenses,
            personalExpenses: dashboardData.personalExpenses,
            lubricantSales: dashboardData.lubricantSales,
            transactions: dashboardData.transactions,
            machines: dashboardData.machines,
          },
          { upsert: true, new: true },
        );
      }
    }

    const lastShift = shifts[shifts.length - 1];

    const currentShift =
      lastShift?.status === ShiftStatusEnum.PENDING
        ? lastShift
        : {
            shiftNumber: (lastShift?.shiftNumber || 0) + 1,
            name: `Shift ${(lastShift?.shiftNumber || 0) + 1}`,
            status: ShiftStatusEnum.PENDING,
          };

    return this.shiftStatusModel.create({
      ...dto,
      shifts,
      adminId,
      currentShift,
    });
  }

  async update(
    user: AuthUser,
    id: string,
    dto: Partial<CreateShiftStatusDto> & { dailyClose?: boolean },
  ) {
    const existing = await this.shiftStatusModel.findById(id);

    if (!existing) {
      throw new NotFoundException("Shift status not found");
    }

    // ❌ Staff not allowed
    if (user.role === Role.STAFF) {
      throw new ForbiddenException("Staff is not allowed to update shift");
    }

    const now = new Date().toISOString();

    const roleModel = this.getRoleModel(user.role);

    const updatePayload: UpdateQuery<ShiftStatus> = {};

    // =====================================================
    // 1️⃣ HANDLE SHIFT UPDATE
    // =====================================================
    if (dto.shifts && dto.shifts.length > 0) {
      for (const incomingShift of dto.shifts) {
        const index = existing.shifts.findIndex(
          (s) => s.shiftNumber === incomingShift.shiftNumber,
        );

        if (index === -1) {
          existing.shifts.push({
            shiftNumber: incomingShift.shiftNumber,
            name: incomingShift.name || `Shift ${incomingShift.shiftNumber}`,
            startTime: incomingShift.startTime,
            endTime: incomingShift.endTime,
            status: incomingShift.status || ShiftStatusEnum.PENDING,
            ...(incomingShift.status === ShiftStatusEnum.COMPLETED && {
              closedBy: new Types.ObjectId(user.adminId || user._id),
              closedByModel: roleModel,
            }),
          });
        } else {
          const oldShift = existing.shifts[index];
          const updatedStatus = incomingShift.status ?? oldShift.status;

          existing.shifts[index] = {
            shiftNumber: incomingShift.shiftNumber || oldShift.shiftNumber,
            name:
              oldShift.name ||
              incomingShift.name ||
              `Shift ${incomingShift.shiftNumber}`,
            startTime: incomingShift.startTime ?? oldShift.startTime,
            endTime:
              incomingShift.status === ShiftStatusEnum.COMPLETED
                ? now
                : (incomingShift.endTime ?? oldShift.endTime),
            status: updatedStatus,
            ...(incomingShift.status === ShiftStatusEnum.COMPLETED && {
              closedBy: new Types.ObjectId(user.adminId || user._id),
              closedByModel: roleModel,
            }),
          };
        }

        // ── Shift complete hone pe dashboard data save karo ──
        if (incomingShift.status === ShiftStatusEnum.COMPLETED) {
          const dashboardData = await this.calculateDashboardData({
            adminId: existing.adminId,
            date: existing.date,
            shiftNumber: incomingShift.shiftNumber,
          });

          // Upsert — same date+shift ka record update ya create
          await this.salesModel.findOneAndUpdate(
            {
              adminId: existing.adminId,
              date: existing.date,
              shiftNumber: incomingShift.shiftNumber,
            },
            {
              adminId: existing.adminId,
              date: existing.date,
              shiftNumber: incomingShift.shiftNumber,
              shiftStatus: ShiftStatusEnum.COMPLETED,
              overallSales: dashboardData.overallSales,
              netSales: dashboardData.netSales,
              testing: dashboardData.testing,
              overallCreditorsAmount: dashboardData.overallCreditorsAmount,
              prepaid: dashboardData.prepaid,
              pumpExpenses: dashboardData.pumpExpenses,
              personalExpenses: dashboardData.personalExpenses,
              lubricantSales: dashboardData.lubricantSales,
              transactions: dashboardData.transactions,
              machines: dashboardData.machines,
            },
            { upsert: true, new: true },
          );
        }
      }

      updatePayload.shifts = existing.shifts;
    }

    // =====================================================
    // 2️⃣ UPDATE currentShift (SAFE) → IF LAST SHIFT COMPLETED, currentShift points to next number
    // =====================================================
    const activeShift = existing.shifts.find(
      (s) => s.status === ShiftStatusEnum.ACTIVE,
    );
    const lastShift = existing.shifts[existing.shifts.length - 1];

    // ✅ Logic: currentShift = activeShift if exists, else last shift (even if completed)
    existing.currentShift = activeShift || {
      shiftNumber: (lastShift?.shiftNumber || 0) + 1, // next shift number
      name: `Shift ${(lastShift?.shiftNumber || 0) + 1}`,
      status: ShiftStatusEnum.PENDING, // not yet started
    };

    updatePayload.currentShift = existing.currentShift;

    // =====================================================
    // 3️⃣ DAILY CLOSE (FULL SAFE)
    // =====================================================
    if (dto.dailyClose === true) {
      if (existing.currentShift?.status !== ShiftStatusEnum.COMPLETED) {
        existing.currentShift.status = ShiftStatusEnum.COMPLETED;
        existing.currentShift.endTime = now;
        existing.currentShift.closedBy = user._id;
        existing.currentShift.closedByModel = roleModel;
      }

      const lastShiftIndex = existing.shifts.length - 1;

      if (lastShiftIndex >= 0) {
        existing.shifts[lastShiftIndex] = {
          ...existing.shifts[lastShiftIndex],
          status: ShiftStatusEnum.COMPLETED,
          endTime: now,
          closedBy: new Types.ObjectId(user.adminId || user._id),
          closedByModel: roleModel,
        };
      }

      updatePayload.pumpStatus = PumpStatusEnum.CLOSED;
      updatePayload.dailyClose = true;
      updatePayload.shifts = existing.shifts;
      updatePayload.currentShift = existing.currentShift;
    }

    // =====================================================
    // 4️⃣ FINAL UPDATE
    // =====================================================
    return this.shiftStatusModel.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });
  }
}
