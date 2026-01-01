import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PumpDetails } from "./pump-details.schema";
import { Admin } from "../admin/admin.schema";
import { CreatePumpDetailsDto } from "./pump-details.dto";

@Injectable()
export class PumpDetailsService {
  constructor(
    @InjectModel(PumpDetails.name)
    private pumpDetailsModel: Model<PumpDetails>,

    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
  ) {}

  async addPumpDetails(adminId: string, dto: CreatePumpDetailsDto) {
    const adminExists = await this.adminModel.findById(adminId);
    if (!adminExists) {
      throw new NotFoundException("Admin not found");
    }

    // optional: only ONE pump detail per admin
    const existing = await this.pumpDetailsModel.findOne({
      adminId,
    });

    if (existing) {
      return this.pumpDetailsModel.findByIdAndUpdate(existing._id, dto, {
        new: true,
      });
    }

    const pumpDetails = await this.pumpDetailsModel.create({
      adminId: new Types.ObjectId(adminId),
      ...dto,
    });

    return pumpDetails;
  }
}
