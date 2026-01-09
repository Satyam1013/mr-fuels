import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DsrDetails } from "./dsr.schema";
import { CreateDsrDetailsDto } from "./dsr.dto";

@Injectable()
export class DsrDetailsService {
  constructor(
    @InjectModel(DsrDetails.name)
    private readonly dsrModel: Model<DsrDetails>,
  ) {}

  async addOrUpdate(adminId: string, dto: CreateDsrDetailsDto) {
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
