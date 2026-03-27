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
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateShiftStatusDto) {
    const existing = await this.shiftStatusModel.findOne({
      adminId,
      date: dto.date,
    });

    if (existing) {
      throw new BadRequestException(
        "Shift status already created for this date",
      );
    }

    return this.shiftStatusModel.create({
      ...dto,
      adminId,
    });
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

    // Normalize role string
    let roleModel: Role;
    switch (user.role.toLowerCase()) {
      case "admin":
        roleModel = Role.ADMIN;
        break;
      case "manager":
        roleModel = Role.MANAGER;
        break;
      case "staff":
        roleModel = Role.STAFF;
        break;
      default:
        roleModel = Role.MANAGER;
    }

    const updatePayload: UpdateQuery<ShiftStatus> = {};

    // =====================================================
    // 1️⃣ HANDLE SHIFT UPDATE (PATCH) → ADD ONLY IF PATCH PROVIDES NEW
    // =====================================================
    if (dto.shifts && dto.shifts.length > 0) {
      dto.shifts.forEach((incomingShift) => {
        const index = existing.shifts.findIndex(
          (s) => s.shiftNumber === incomingShift.shiftNumber,
        );

        if (index === -1) {
          // 🔹 NEW shift → only if patch explicitly has it
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
          // 🔹 EXISTING shift → update fields
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
      });

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
