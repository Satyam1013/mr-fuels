import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
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

  // 🔹 Create
  async create(adminId: string, dto: CreateTankDetailsDto) {
    const adminIdObj = new Types.ObjectId(adminId);

    const tank = await this.tankModel.create({
      adminId: adminIdObj,
      ...dto,
    });

    const tankExists = await this.tankModel.findOne({
      adminId: adminIdObj,
    });

    if (tankExists) {
      throw new ConflictException("Tank already exist for this admin");
    }

    return {
      message: "Tank details created successfully",
      data: tank,
    };
  }

  // 🔹 Get All (by admin)
  async findAll(adminId: string) {
    const objectAdminId = new Types.ObjectId(adminId);
    return this.tankModel.find({ adminId: objectAdminId }).lean();
  }

  // 🔹 Get Single
  async findOne(id: string) {
    const tank = await this.tankModel.findById(id).lean();

    if (!tank) throw new NotFoundException("Tank not found");

    return tank;
  }

  // 🔹 Update
  async update(id: string, dto: UpdateTankDetailsDto) {
    const updated = await this.tankModel.findByIdAndUpdate(id, dto, {
      new: true,
    });

    if (!updated) throw new NotFoundException("Tank not found");

    return {
      message: "Tank updated successfully",
      data: updated,
    };
  }

  // 🔹 Delete
  async remove(id: string) {
    const deleted = await this.tankModel.findByIdAndDelete(id);

    if (!deleted) throw new NotFoundException("Tank not found");

    return {
      message: "Tank deleted successfully",
    };
  }
}
