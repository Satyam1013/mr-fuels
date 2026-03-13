import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Machine } from "./machines.schema";
import { CreateMachineDto } from "./machines.dto";

@Injectable()
export class MachineService {
  constructor(
    @InjectModel(Machine.name) private machineModel: Model<Machine>,
  ) {}

  async createMachines(adminId: string, machines: CreateMachineDto[]) {
    const docs = machines.map((m) => ({
      ...m,
      adminId: new Types.ObjectId(adminId),
      nozzle: m.nozzle.map((n) => ({
        ...n,
        tankId: new Types.ObjectId(n.tankId),
      })),
    }));

    return this.machineModel.insertMany(docs);
  }

  async getMachines(adminId: string) {
    return this.machineModel.find({ adminId: new Types.ObjectId(adminId) });
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
