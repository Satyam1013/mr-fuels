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

  async create(adminId: string, dto: CreateTankDetailsDto) {
    const adminIdObj = new Types.ObjectId(adminId);

    const existing = await this.tankModel.findOne({ adminId: adminIdObj });

    if (existing) {
      throw new ConflictException(
        "Tank details already created for this admin",
      );
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

  async updateMany(adminId: string, dto: UpdateTankDetailsDto) {
    const adminIdObj = new Types.ObjectId(adminId);

    if (!dto.tanks || dto.tanks.length === 0) {
      throw new NotFoundException("No tanks provided for update");
    }

    const tankDoc = await this.tankModel.findOne({ adminId: adminIdObj });

    if (!tankDoc) throw new NotFoundException("Tank document not found");

    dto.tanks.forEach((updateTank) => {
      const tank = tankDoc.tanks.find(
        (t) => updateTank._id && String(t._id) === String(updateTank._id),
      );

      if (tank) {
        tank.capacityKl = updateTank.capacityKl ?? tank.capacityKl;
        tank.dsrTankStock = updateTank.dsrTankStock ?? tank.dsrTankStock;
        tank.fuelType = updateTank.fuelType ?? tank.fuelType;
        tank.price = updateTank.price ?? tank.price;
        tank.tankNo = updateTank.tankNo ?? tank.tankNo;
      }
    });

    await tankDoc.save();

    return {
      message: "Tanks updated successfully",
      data: tankDoc,
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
