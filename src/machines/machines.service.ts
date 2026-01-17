import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Machine } from "./machines.schema";
import { CreateMachineDto } from "./machines.dto";

@Injectable()
export class MachineService {
  constructor(
    @InjectModel(Machine.name) private machineModel: Model<Machine>,
  ) {}

  async createMachine(adminId: string, dto: CreateMachineDto) {
    const existing = await this.machineModel.findOne({
      adminId,
      machineNumber: dto.machineNumber,
    });

    if (existing) {
      throw new BadRequestException(
        "Machine number already exists for this admin",
      );
    }

    const machine = await this.machineModel.create({
      adminId: new Types.ObjectId(adminId),
      ...dto,
    });

    return machine;
  }

  async getMachines(adminId: string) {
    return this.machineModel.find({ adminId });
  }

  async getMachineById(machineId: string) {
    return this.machineModel.findById(machineId);
  }

  async updateMachine(machineId: string, dto: Partial<CreateMachineDto>) {
    return this.machineModel.findByIdAndUpdate(machineId, dto, { new: true });
  }

  async deleteMachine(machineId: string) {
    return this.machineModel.findByIdAndDelete(machineId);
  }
}
