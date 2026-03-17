import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ShiftStatus } from "./shift-status.schema";
import { CreateShiftStatusDto } from "./shift-status.dto";
import { PumpDetails } from "../pump-details/pump-details.schema";
import { ShiftStatusEnum } from "./shift-status.enum";
import { AuthUser } from "../auth/user.type";

interface PumpDetailsLean {
  numberOfShifts: number;
  pumpTime: {
    start: string;
  };
}
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

    // check exact data
    const exact = await this.shiftStatusModel.findOne({
      adminId: adminObjectId,
      date: requestedDate,
    });

    // ----------- EXACT DATA -----------
    if (exact) {
      const completedShifts = exact.shifts.filter(
        (s) => s.status === ShiftStatusEnum.COMPLETED,
      ).length;

      const pendingShifts = pumpDetails.numberOfShifts - completedShifts;

      const percent = (completedShifts / pumpDetails.numberOfShifts) * 100;

      return {
        date: requestedDate,
        totalShifts: pumpDetails.numberOfShifts,

        currentShift: exact.currentShift,

        shifts: exact.shifts,

        dailyProgress: {
          completedShifts,
          pendingShifts,
          overallCompletionPercent: percent,
        },

        dailyClose: exact.dailyClose,
        pumpStatus: exact.pumpStatus,
      };
    }

    // ----------- LATEST RECORD -----------
    const latest = await this.shiftStatusModel
      .findOne({ adminId: adminObjectId })
      .sort({ date: -1 });

    if (!latest) {
      return this.buildTemplate(
        pumpDetails,
        requestedDate,
        formattedNumberDate,
      );
    }

    const first = await this.shiftStatusModel
      .findOne({ adminId: adminObjectId })
      .sort({ date: 1 });

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

    // unfinished previous day
    if (!latest.dailyClose && requestedDate > latest.date) {
      const completedShifts = latest.shifts.filter(
        (s) => s.status === ShiftStatusEnum.COMPLETED,
      ).length;

      const pendingShifts = pumpDetails.numberOfShifts - completedShifts;

      const percent = (completedShifts / pumpDetails.numberOfShifts) * 100;

      return {
        date: latest.date,
        requestedDate,
        reason: "previous_unfinished_day",

        totalShifts: pumpDetails.numberOfShifts,

        currentShift: latest.currentShift,

        shifts: latest.shifts,

        dailyProgress: {
          completedShifts,
          pendingShifts,
          overallCompletionPercent: percent,
        },

        dailyClose: latest.dailyClose,
        pumpStatus: latest.pumpStatus,
      };
    }

    if (requestedDate <= today) {
      return {
        message: "No data available for this date",
        date: requestedDate,
      };
    }

    // future template
    return this.buildTemplate(pumpDetails, requestedDate, formattedNumberDate);
  }

  async update(id: string, dto: Partial<CreateShiftStatusDto>) {
    return this.shiftStatusModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async closeDay(user: AuthUser, id: string): Promise<ShiftStatus | null> {
    return this.shiftStatusModel.findByIdAndUpdate(
      id,
      {
        dailyClose: true,
        closedBy: new Types.ObjectId(user._id),
        closedByModel: user.role,
      },
      { new: true },
    );
  }
}
