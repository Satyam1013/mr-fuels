import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { TankDetails } from "./tank-details.schema";
import { CreateTankDetailsDto, UpdateTankDetailsDto } from "./tank-details.dto";

@Injectable()
export class TankService {
  constructor(
    @InjectModel(TankDetails.name)
    private tankModel: Model<TankDetails>,
  ) {}

  async create(adminId: string, dto: CreateTankDetailsDto) {
    const adminIdObj = new Types.ObjectId(adminId);

    const existing = await this.tankModel.findOne({ adminId: adminIdObj });

    if (existing) {
      existing.tanks.push(...dto.tanks);
      await existing.save();

      return {
        message: "Tanks added successfully",
        data: existing,
      };
    }

    const tank = await this.tankModel.create({
      adminId: adminIdObj,
      tanks: dto.tanks,
    });

    return {
      message: "Tank details created successfully",
      data: tank,
    };
  }

  async findAll(adminId: string) {
    const objectAdminId = new Types.ObjectId(adminId);
    return this.tankModel.find({ adminId: objectAdminId }).lean();
  }

  async findOne(id: string) {
    const tank = await this.tankModel.findById(id).lean();

    if (!tank) throw new NotFoundException("Tank not found");

    return tank;
  }

  async update(adminId: string, id: string, dto: UpdateTankDetailsDto) {
    const adminIdObj = new Types.ObjectId(adminId);

    const updated = await this.tankModel.findOneAndUpdate(
      { _id: id, adminId: adminIdObj },
      dto,
      { new: true },
    );

    if (!updated) throw new NotFoundException("Tank not found");

    return {
      message: "Tank updated successfully",
      data: updated,
    };
  }

  async remove(id: string) {
    const deleted = await this.tankModel.findByIdAndDelete(id);

    if (!deleted) throw new NotFoundException("Tank not found");

    return {
      message: "Tank deleted successfully",
    };
  }
}
