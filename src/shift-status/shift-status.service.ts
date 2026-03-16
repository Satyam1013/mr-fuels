import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ShiftStatus } from "./shift-status.schema";
import { CreateShiftStatusDto } from "./shift-status.dto";
import { PumpStatusEnum } from "./shift-status.enum";

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

    // 1️⃣ exact date find
    const data = await this.shiftStatusModel.findOne({
      adminId: adminObjectId,
      date,
    });

    if (data) {
      if (
        data.pumpStatus === PumpStatusEnum.CLOSED ||
        data.pumpStatus === PumpStatusEnum.HOLIDAY
      ) {
        return {
          message: "Pump is closed",
          pumpStatus: data.pumpStatus,
        };
      }

      return data;
    }

    // 2️⃣ latest record find
    const latest = await this.shiftStatusModel
      .findOne({ adminId: adminObjectId })
      .sort({ date: -1 });

    if (!latest) {
      return {
        message: "no data is available",
        pumpStatus: PumpStatusEnum.OPEN,
      };
    }

    const today = new Date().toISOString().split("T")[0];

    // agar last day close nahi hua → wahi chal raha hai
    if (!latest.dailyClose) {
      return latest;
    }

    // agar requested date today hai aur aaj ka record nahi bana
    if (date === today) {
      return {
        message: "no data is available",
        pumpStatus: PumpStatusEnum.OPEN,
      };
    }

    return {
      message: "no data is available",
      pumpStatus: PumpStatusEnum.OPEN,
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
