import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { TankDetails } from "./tank-details.schema";
import { CreateTankDetailsDto, UpdateTankDetailsDto } from "./tank-details.dto";
import {
  FuelProductDetail,
  FuelProductDetails,
} from "../fuel-product/fuel-product.schema";

@Injectable()
export class TankService {
  constructor(
    @InjectModel(TankDetails.name)
    private tankModel: Model<TankDetails>,

    @InjectModel(FuelProductDetails.name)
    private fuelProductDetailsModel: Model<FuelProductDetails>,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateTankDetailsDto) {
    const existing = await this.tankModel.findOne({ adminId });

    if (existing) {
      throw new ConflictException(
        "Tank details already created for this admin",
      );
    }

    const tank = await this.tankModel.create({
      adminId,
      tanks: dto.tanks.map((t) => ({
        ...t,
        fuelProductId: new Types.ObjectId(t.fuelProductId),
      })),
    });

    return {
      message: "Tank details created successfully",
      data: tank,
    };
  }

  async findAll(adminId: Types.ObjectId) {
    const [tankDetails, fuelProductDetails] = await Promise.all([
      this.tankModel.findOne({ adminId }).lean(),
      this.fuelProductDetailsModel.findOne({ adminId }).lean(),
    ]);

    if (!tankDetails) return [];

    const tanks = tankDetails.tanks.map((tank) => {
      const product = fuelProductDetails?.products.find(
        (p) =>
          (p as FuelProductDetail)._id.toString() ===
          tank.fuelProductId.toString(),
      );

      return {
        ...tank,
        fuelType: product?.fuelType,
        price: product?.price,
        purchasingPrice: product?.purchasingPrice,
      };
    });

    return tanks;
  }

  async findOne(id: string) {
    const tankDoc = await this.tankModel.findById(id).lean();

    if (!tankDoc) throw new NotFoundException("Tank not found");

    const fuelProductDetails = await this.fuelProductDetailsModel
      .findOne({ adminId: tankDoc.adminId })
      .lean();

    const tanks = tankDoc.tanks.map((tank) => {
      const product = fuelProductDetails?.products.find(
        (p) =>
          (p as FuelProductDetail)._id.toString() ===
          tank.fuelProductId.toString(),
      );

      return {
        ...tank,
        fuelType: product?.fuelType,
        price: product?.price,
        purchasingPrice: product?.purchasingPrice,
      };
    });

    return { ...tankDoc, tanks };
  }

  async updateMany(adminId: Types.ObjectId, dto: UpdateTankDetailsDto) {
    if (!dto.tanks || dto.tanks.length === 0) {
      throw new NotFoundException("No tanks provided for update");
    }

    const tankDoc = await this.tankModel.findOne({ adminId });

    if (!tankDoc) throw new NotFoundException("Tank document not found");

    dto.tanks.forEach((updateTank) => {
      const tank = tankDoc.tanks.find(
        (t) => updateTank._id && String(t._id) === String(updateTank._id),
      );

      if (tank) {
        tank.capacityKl = updateTank.capacityKl ?? tank.capacityKl;
        tank.dsrTankStock = updateTank.dsrTankStock ?? tank.dsrTankStock;
        tank.tankNo = updateTank.tankNo ?? tank.tankNo;
        if (updateTank.fuelProductId) {
          tank.fuelProductId = new Types.ObjectId(updateTank.fuelProductId);
        }
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
