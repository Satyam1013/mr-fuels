import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PumpDetails } from "./pump-details.schema";
import { Admin } from "../admin/admin.schema";
import { CreatePumpDetailsDto, UpdatePumpDetailsDto } from "./pump-details.dto";
import { TankDetails } from "../tank-details/tank-details.schema";
import {
  FuelProductDetail,
  FuelProductDetails,
} from "../fuel-product/fuel-product.schema";

@Injectable()
export class PumpDetailsService {
  constructor(
    @InjectModel(PumpDetails.name)
    private pumpDetailsModel: Model<PumpDetails>,

    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,

    @InjectModel(TankDetails.name)
    private tankModel: Model<TankDetails>,

    @InjectModel(FuelProductDetails.name)
    private fuelProductDetailsModel: Model<FuelProductDetails>,
  ) {}

  async addPumpDetails(adminId: Types.ObjectId, dto: CreatePumpDetailsDto) {
    const adminExists = await this.adminModel.findById(adminId);
    if (!adminExists) {
      throw new NotFoundException("Admin not found");
    }

    const tankIdObj = new Types.ObjectId(dto.tank);

    const tankExists = await this.tankModel.findOne({
      _id: tankIdObj,
      adminId,
    });

    if (!tankExists) {
      throw new NotFoundException(
        "Tank not found or does not belong to this admin",
      );
    }

    const existing = await this.pumpDetailsModel.findOne({
      adminId,
    });

    if (existing) {
      throw new ConflictException("Pump details already exist for this admin");
    }

    const payload = {
      adminId,
      ...dto,
      tank: tankIdObj,
    };

    return this.pumpDetailsModel.create(payload);
  }

  async getPumpDetails(adminId: Types.ObjectId) {
    const [pumpDetails, tankDetails, fuelProductDetails] = await Promise.all([
      this.pumpDetailsModel.findOne({ adminId }).lean(),
      this.tankModel.findOne({ adminId }).lean(),
      this.fuelProductDetailsModel.findOne({ adminId }).lean(),
    ]);

    if (!pumpDetails) throw new NotFoundException("Pump details not found");

    const tanks =
      tankDetails?.tanks.map((t) => {
        const product = fuelProductDetails?.products.find(
          (p) =>
            (p as FuelProductDetail)._id.toString() ===
            t.fuelProductId.toString(),
        );
        return {
          ...t,
          fuelType: product?.fuelType ?? null,
          price: product?.price ?? null,
          purchasingPrice: product?.purchasingPrice ?? null,
        };
      }) ?? [];

    return {
      ...pumpDetails,
      tanks,
    };
  }

  async updatePumpDetails(adminId: Types.ObjectId, dto: UpdatePumpDetailsDto) {
    const pumpDetails = await this.pumpDetailsModel.findOne({
      adminId,
    });

    if (!pumpDetails) {
      throw new NotFoundException("Pump details not found");
    }

    if (dto.tank) {
      const tankExists = await this.tankModel.findOne({
        _id: new Types.ObjectId(dto.tank),
        adminId,
      });

      if (!tankExists) {
        throw new NotFoundException(
          "Tank not found or does not belong to this admin",
        );
      }
    }

    const payload: Partial<PumpDetails> = {
      fuelPartner: dto.fuelPartner,
      pumpHours: dto.pumpHours,
      numberOfShifts: dto.numberOfShifts,
      pumpTime: dto.pumpTime,
      dailyCloseReportTime: dto.dailyCloseReportTime,
      is24Hour: dto.is24Hour,
    };

    if (dto.tank) {
      payload.tank = new Types.ObjectId(dto.tank);
    }

    return this.pumpDetailsModel.findOneAndUpdate(adminId, payload, {
      new: true,
    });
  }

  async deletePumpDetails(adminId: Types.ObjectId) {
    const deleted = await this.pumpDetailsModel.findOneAndDelete({
      adminId,
    });

    if (!deleted) throw new NotFoundException("Pump details not found");

    return { message: "Pump details deleted successfully" };
  }
}
