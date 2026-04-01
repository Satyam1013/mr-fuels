import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Machine } from "./machines.schema";
import { CreateMachineDto } from "./machines.dto";
import {
  FuelProductDetail,
  FuelProductDetails,
} from "../fuel-product/fuel-product.schema";

@Injectable()
export class MachineService {
  constructor(
    @InjectModel(Machine.name) private machineModel: Model<Machine>,

    @InjectModel(FuelProductDetails.name)
    private fuelProductDetailsModel: Model<FuelProductDetails>,
  ) {}

  async createMachines(adminId: Types.ObjectId, machines: CreateMachineDto[]) {
    const docs = machines.map((m) => ({
      ...m,
      adminId,
      nozzle: m.nozzle.map((n) => ({
        ...n,
        fuelProductId: new Types.ObjectId(n.fuelProductId),
        tankId: new Types.ObjectId(n.tankId),
      })),
    }));

    return this.machineModel.insertMany(docs);
  }

  async getMachines(adminId: Types.ObjectId) {
    const [machines, fuelProductDetails] = await Promise.all([
      this.machineModel.find({ adminId }).lean(),
      this.fuelProductDetailsModel.findOne({ adminId }).lean(),
    ]);

    return machines.map((machine) => ({
      ...machine,
      nozzle: machine.nozzle.map((nozzle) => {
        const product = fuelProductDetails?.products.find(
          (p) =>
            (p as FuelProductDetail)._id.toString() ===
            nozzle.fuelProductId.toString(),
        );
        return {
          ...nozzle,
          fuelType: product?.fuelType,
          price: product?.price,
          purchasingPrice: product?.purchasingPrice,
        };
      }),
    }));
  }

  async getMachineById(machineId: string) {
    const machine = await this.machineModel.findById(machineId).lean();

    if (!machine) return null;

    const fuelProductDetails = await this.fuelProductDetailsModel
      .findOne({ adminId: machine.adminId })
      .lean();

    return {
      ...machine,
      nozzle: machine.nozzle.map((nozzle) => {
        const product = fuelProductDetails?.products.find(
          (p) =>
            (p as FuelProductDetail)._id.toString() ===
            nozzle.fuelProductId.toString(),
        );
        return {
          ...nozzle,
          fuelType: product?.fuelType,
          price: product?.price,
          purchasingPrice: product?.purchasingPrice,
        };
      }),
    };
  }

  async updateMachine(machineId: string, dto: Partial<CreateMachineDto>) {
    if (dto.nozzle) {
      const nozzles = dto.nozzle.map((n) => ({
        ...n,
        fuelProductId: new Types.ObjectId(n.fuelProductId),
        tankId: new Types.ObjectId(n.tankId),
      }));

      return this.machineModel.findByIdAndUpdate(
        machineId,
        { ...dto, nozzle: nozzles },
        { new: true },
      );
    }

    return this.machineModel.findByIdAndUpdate(machineId, dto, { new: true });
  }

  async deleteMachine(machineId: string) {
    return this.machineModel.findByIdAndDelete(machineId);
  }
}
