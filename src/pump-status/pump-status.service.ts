import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PumpStatus } from "./pump-status.schema";
import { CreatePumpStatusDto, UpdatePumpStatusDto } from "./pump-status.dto";

@Injectable()
export class PumpStatusService {
  constructor(
    @InjectModel(PumpStatus.name)
    private pumpModel: Model<PumpStatus>,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreatePumpStatusDto) {
    return this.pumpModel.create({
      ...dto,
      adminId,
      handledBy: new Types.ObjectId(dto.handledBy),
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  async findAll(adminId: Types.ObjectId) {
    return this.pumpModel.find({ adminId }).populate("handledBy").lean();
  }

  async updateStatus(id: string, dto: UpdatePumpStatusDto) {
    return this.pumpModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        ...(dto.handledBy && { handledBy: new Types.ObjectId(dto.handledBy) }),
        lastUpdatedAt: new Date().toISOString(),
      },
      { new: true },
    );
  }

  async delete(id: string) {
    return this.pumpModel.findByIdAndDelete(id);
  }
}
