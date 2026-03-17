import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types, UpdateQuery } from "mongoose";
import { ShiftStatus } from "./shift-status.schema";
import { CreateShiftStatusDto } from "./shift-status.dto";
import { PumpDetails } from "../pump-details/pump-details.schema";
import { PumpStatusEnum, ShiftStatusEnum } from "./shift-status.enum";
import { AuthUser } from "../auth/user.type";
import { Role } from "../admin/admin.enum";

interface PumpDetailsLean {
  numberOfShifts: number;
  pumpTime: {
    start: string;
  };
}

type PopulatedShift = {
  shiftNumber: number;
  name: string;
  startTime?: string;
  endTime?: string;
  status: ShiftStatusEnum;
  closedBy?: {
    _id: Types.ObjectId;
    name: string;
  };
  closedByModel?: Role;
};

type ShiftStatusPopulated = {
  date: string;
  shifts: PopulatedShift[];
  currentShift: PopulatedShift;
  dailyClose: boolean;
  pumpStatus: PumpStatusEnum;
};

@Injectable()
export class ShiftStatusService {
  constructor(
    @InjectModel(ShiftStatus.name)
    private shiftStatusModel: Model<ShiftStatus>,

    @InjectModel(PumpDetails.name)
    private pumpDetailsModel: Model<PumpDetails>,
  ) {}

  async create(adminId: string, dto: CreateShiftStatusDto) {
    const adminObjectId = new Types.ObjectId(adminId);

    const existing = await this.shiftStatusModel.findOne({
      adminId: adminObjectId,
      date: dto.date,
    });

    if (existing) {
      throw new BadRequestException(
        "Shift status already created for this date",
      );
    }

    return this.shiftStatusModel.create({
      ...dto,
      adminId: adminObjectId,
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

  async getByDate(adminId: string, date: string) {
    const adminObjectId = new Types.ObjectId(adminId);

    const pumpDetails = await this.pumpDetailsModel
      .findOne({ adminId: adminObjectId })
      .lean();

    if (!pumpDetails) {
      throw new Error("Pump details not found");
    }

    const today = new Date().toISOString().split("T")[0];
    const requestedDate = date || today;

    const formattedNumberDate = Number(requestedDate.replace(/-/g, "") + "01");

    // helper
    const mapClosedBy = (shift: PopulatedShift) => {
      if (!shift?.closedBy) return "";

      return {
        id: shift.closedBy._id.toString(),
        name: shift.closedBy.name,
        role: shift.closedByModel,
      };
    };

    const mapResponse = (data: ShiftStatusPopulated) => {
      const completedShifts = data.shifts.filter(
        (s) => s.status === ShiftStatusEnum.COMPLETED,
      ).length;

      const pendingShifts = pumpDetails.numberOfShifts - completedShifts;

      const percent = (completedShifts / pumpDetails.numberOfShifts) * 100;

      return {
        date: data.date,
        totalShifts: pumpDetails.numberOfShifts,

        currentShift: {
          ...data.currentShift,
          closedBy: mapClosedBy(data.currentShift),
        },

        shifts: data.shifts.map((s) => ({
          ...s,
          closedBy: mapClosedBy(s),
        })),

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
      .findOne({
        adminId: adminObjectId,
        date: requestedDate,
      })
      .populate("shifts.closedBy", "name")
      .populate("currentShift.closedBy", "name")
      .lean<ShiftStatusPopulated>(); // ✅ KEY FIX

    if (exact) {
      return mapResponse(exact);
    }

    // ----------- LATEST RECORD -----------
    const latest = await this.shiftStatusModel
      .findOne({ adminId: adminObjectId })
      .sort({ date: -1 })
      .populate("shifts.closedBy", "name")
      .populate("currentShift.closedBy", "name")
      .lean<ShiftStatusPopulated>(); // ✅ KEY FIX

    if (!latest) {
      return this.buildTemplate(
        pumpDetails,
        requestedDate,
        formattedNumberDate,
      );
    }

    const first = await this.shiftStatusModel
      .findOne({ adminId: adminObjectId })
      .sort({ date: 1 })
      .lean();

    if (!first) {
      return this.buildTemplate(
        pumpDetails,
        requestedDate,
        formattedNumberDate,
      );
    }

    if (requestedDate < first.date) {
      return {
        message:
          "Selected date does not come in range, please try after the first registered date",
        firstRegisteredDate: first.date,
      };
    }

    // ----------- PREVIOUS UNFINISHED -----------
    if (!latest.dailyClose && requestedDate > latest.date) {
      return {
        ...mapResponse(latest),
        requestedDate,
        reason: "previous_unfinished_day",
      };
    }

    if (requestedDate <= today) {
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

    const updatePayload: UpdateQuery<ShiftStatus> = {
      ...dto,
    };

    if (dto.dailyClose === true) {
      if (existing.currentShift?.status !== ShiftStatusEnum.COMPLETED) {
        existing.currentShift.status = ShiftStatusEnum.COMPLETED;
        existing.currentShift.endTime = new Date().toISOString();
        existing.currentShift.closedBy = new Types.ObjectId(user._id);
      }

      const lastShiftIndex = existing.shifts.length - 1;

      if (lastShiftIndex >= 0) {
        existing.shifts[lastShiftIndex].status = ShiftStatusEnum.COMPLETED;
        existing.shifts[lastShiftIndex].endTime = new Date().toISOString();
      }

      updatePayload.pumpStatus = PumpStatusEnum.CLOSED;
      updatePayload.dailyClose = true;

      updatePayload.shifts = existing.shifts;
      updatePayload.currentShift = existing.currentShift;
    }

    return this.shiftStatusModel.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });
  }
}
