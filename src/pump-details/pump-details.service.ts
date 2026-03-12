import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PumpDetails } from "./pump-details.schema";
import { Admin } from "../admin/admin.schema";
import { CreatePumpDetailsDto } from "./pump-details.dto";
import { TankDetails } from "../tank-details/tank-details.schema";

@Injectable()
export class PumpDetailsService {
  constructor(
    @InjectModel(PumpDetails.name)
    private pumpDetailsModel: Model<PumpDetails>,

    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,

    @InjectModel(TankDetails.name)
    private tankModel: Model<TankDetails>,
  ) {}

  async addPumpDetails(adminId: string, dto: CreatePumpDetailsDto) {
    const adminExists = await this.adminModel.findById(adminId);
    if (!adminExists) {
      throw new NotFoundException("Admin not found");
    }

    const tankExists = await this.tankModel.findOne({
      _id: new Types.ObjectId(dto.tank),
      adminId: new Types.ObjectId(adminId),
    });

    if (!tankExists) {
      throw new NotFoundException(
        "Tank not found or does not belong to this admin",
      );
    }

    const existing = await this.pumpDetailsModel.findOne({
      adminId: new Types.ObjectId(adminId),
    });

    if (existing) {
      throw new ConflictException("Pump details already exist for this admin");
    }

    const payload = {
      adminId: new Types.ObjectId(adminId),
      ...dto,
      tank: new Types.ObjectId(dto.tank),
    };

    return this.pumpDetailsModel.create(payload);
  }

  async getPumpDetails(adminId: string) {
    const pumpDetails = await this.pumpDetailsModel
      .findOne({ adminId: new Types.ObjectId(adminId) })
      .populate("tank");

    if (!pumpDetails) throw new NotFoundException("Pump details not found");

    return pumpDetails;
  }

  // 🔹 Update PumpDetails
  async updatePumpDetails(adminId: string, dto: CreatePumpDetailsDto) {
    const pumpDetails = await this.pumpDetailsModel.findOne({ adminId });
    if (!pumpDetails) throw new NotFoundException("Pump details not found");

    const tankExists = await this.tankModel.findOne({
      _id: new Types.ObjectId(dto.tank),
      adminId: new Types.ObjectId(adminId),
    });
    if (!tankExists)
      throw new NotFoundException(
        "Tank not found or does not belong to this admin",
      );

    const payload = {
      fuelPartner: dto.fuelPartner,
      tank: new Types.ObjectId(dto.tank),
      pumpTime: dto.pumpTime,
      pumpHours: dto.pumpHours,
      dailyCloseReportTime: dto.dailyCloseReportTime,
      is24Hour: dto.is24Hour ?? false,
    };

    return this.pumpDetailsModel.findByIdAndUpdate(pumpDetails._id, payload, {
      new: true,
    });
  }

  // 🔹 Delete PumpDetails
  async deletePumpDetails(adminId: string) {
    const pumpDetails = await this.pumpDetailsModel.findOne({ adminId });
    if (!pumpDetails) throw new NotFoundException("Pump details not found");

    await this.pumpDetailsModel.findByIdAndDelete(pumpDetails._id);
    return { message: "Pump details deleted successfully" };
  }
}
