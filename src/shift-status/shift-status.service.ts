import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ShiftStatus } from "./shift-status.schema";
import { CreateShiftStatusDto } from "./shift-status.dto";

@Injectable()
export class ShiftStatusService {
  constructor(
    @InjectModel(ShiftStatus.name)
    private shiftStatusModel: Model<ShiftStatus>,
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

  async getByDate(adminId: string, date: string) {
    const adminObjectId = new Types.ObjectId(adminId);
    const today = new Date().toISOString().split("T")[0];

    const requestedDate = date || today;

    // exact match
    const exact = await this.shiftStatusModel.findOne({
      adminId: adminObjectId,
      date: requestedDate,
    });

    if (exact) {
      return {
        mode: "exact",
        data: exact,
      };
    }

    // find latest record
    const latest = await this.shiftStatusModel
      .findOne({ adminId: adminObjectId })
      .sort({ date: -1 });

    // no history
    if (!latest) {
      return {
        mode: "template",
        reason: "no_history",
        date: requestedDate,
      };
    }

    const first = await this.shiftStatusModel
      .findOne({ adminId: adminObjectId })
      .sort({ date: 1 });

    if (!first) {
      return {
        mode: "template",
        reason: "no_history",
        date: requestedDate,
      };
    }

    const firstDate = first.date;

    if (requestedDate < firstDate) {
      return {
        mode: "out_of_range",
        message:
          "Selected date does not come in range, please try after the first registered date",
        firstRegisteredDate: firstDate,
      };
    }

    // unfinished previous day
    if (!latest.dailyClose && requestedDate > latest.date) {
      return {
        mode: "fallback",
        date: latest.date,
        requestedDate,
        reason: "previous_unfinished_day",
        data: latest,
      };
    }

    // missing row between first date and today
    if (requestedDate <= today) {
      return {
        mode: "no_data",
        reason: "no_data_for_date",
        date: requestedDate,
      };
    }

    // future date with all previous closed
    return {
      mode: "template",
      reason: "no_data_for_date",
      date: requestedDate,
    };
  }

  async update(id: string, dto: Partial<CreateShiftStatusDto>) {
    return this.shiftStatusModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
  }

  async closeDay(id: string) {
    return this.shiftStatusModel.findByIdAndUpdate(
      id,
      { dailyClose: true },
      { new: true },
    );
  }
}
