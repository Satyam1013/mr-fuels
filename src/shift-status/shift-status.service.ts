import { Injectable } from "@nestjs/common";
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
    return this.shiftStatusModel.create({
      ...dto,
      adminId: new Types.ObjectId(adminId),
    });
  }

  async getByDate(adminId: string, date: string) {
    return this.shiftStatusModel.findOne({
      adminId: new Types.ObjectId(adminId),
      date,
    });
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
