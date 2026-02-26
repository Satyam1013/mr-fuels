import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DsrDetails } from "./dsr.schema";
import { CreateDsrDetailsDto } from "./dsr.dto";
import { TankInputType } from "../types/dsr-details-types";

@Injectable()
export class DsrDetailsService {
  constructor(
    @InjectModel(DsrDetails.name)
    private readonly dsrModel: Model<DsrDetails>,
  ) {}

  async addOrUpdate(adminId: string, dto: CreateDsrDetailsDto) {
    for (const tank of dto.tankConfig) {
      if (tank.inputType === TankInputType.CHART && !tank.dsrChart) {
        throw new Error(`DSR Chart is required for tank ${tank.tankNo}`);
      }

      if (
        tank.inputType === TankInputType.MANUAL &&
        (!tank.capacity || !tank.diameter || !tank.length || !tank.tankType)
      ) {
        throw new Error(
          `All manual fields are required for tank ${tank.tankNo}`,
        );
      }
    }

    const existing = await this.dsrModel.findOne({ adminId });

    if (existing) {
      existing.tankConfig = dto.tankConfig;
      return existing.save();
    }

    return this.dsrModel.create({
      adminId: new Types.ObjectId(adminId),
      tankConfig: dto.tankConfig,
    });
  }

  async getByAdmin(adminId: string) {
    return this.dsrModel.findOne({ adminId });
  }
}
