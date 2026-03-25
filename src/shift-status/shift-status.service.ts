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
import {
  PopulatedShift,
  PumpDetailsLean,
  ShiftStatusPopulated,
} from "./shift-status.types";

@Injectable()
export class ShiftStatusService {
  constructor(
    @InjectModel(ShiftStatus.name)
    private shiftStatusModel: Model<ShiftStatus>,

    @InjectModel(PumpDetails.name)
    private pumpDetailsModel: Model<PumpDetails>,
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

      const percent =
        pumpDetails.numberOfShifts > 0
          ? (completedShifts / pumpDetails.numberOfShifts) * 100
          : 0;

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
        adminId,
        date: requestedDate,
      })
      .populate("shifts.closedBy", "name")
      .populate("currentShift.closedBy", "name")
      .lean<ShiftStatusPopulated>();

    if (exact) {
      return mapResponse(exact);
    }

    // ----------- LATEST RECORD -----------
    const latest = await this.shiftStatusModel
      .findOne({ adminId })
      .sort({ date: -1 })
      .populate("shifts.closedBy", "name")
      .populate("currentShift.closedBy", "name")
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

    // ----------- PREVIOUS UNFINISHED (MAIN FIX) -----------
    if (!latest.dailyClose && reqDateObj > latestDateObj) {
      return {
        ...mapResponse(latest),
        requestedDate,
        reason: "previous_unfinished_day",
      };
    }

    // ----------- NO DATA FOR PAST / TODAY -----------
    if (reqDateObj <= todayObj) {
      return {
        message: "No data available for this date",
        date: requestedDate,
      };
    }

    // ----------- FUTURE TEMPLATE -----------
    return this.buildTemplate(pumpDetails, requestedDate, formattedNumberDate);
  }

  async update(
    user: Types.ObjectId,
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
