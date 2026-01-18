import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PumpTiming } from "./pump-timing.schema";
import { UpdatePumpTimingDto } from "./pump-timing.dto";

@Injectable()
export class PumpTimingService {
  constructor(
    @InjectModel(PumpTiming.name) private timingModel: Model<PumpTiming>,
  ) {}

  async updateTiming(adminId: string, dto: UpdatePumpTimingDto) {
    return this.timingModel.findOneAndUpdate(
      { adminId: new Types.ObjectId(adminId) },
      { ...dto, adminId: new Types.ObjectId(adminId) },
      { upsert: true, new: true },
    );
  }

  async getTiming(adminId: string) {
    return this.timingModel.findOne({ adminId: new Types.ObjectId(adminId) });
  }
}
