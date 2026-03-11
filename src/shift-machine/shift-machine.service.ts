import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";

import { Machine } from "../machines/machines.schema";
import { ShiftMachineEntry } from "./shift-machine.schema";
import { CreateShiftMachineDto } from "./shift-machine.dto";

@Injectable()
export class ShiftMachineService {
  constructor(
    @InjectModel(ShiftMachineEntry.name)
    private shiftModel: Model<ShiftMachineEntry>,

    @InjectModel(Machine.name)
    private machineModel: Model<Machine>,
  ) {}

  async create(adminId: string, dto: CreateShiftMachineDto) {
    const machine = await this.machineModel.findOne({
      adminId: new Types.ObjectId(adminId),
      machineNumber: dto.machineName,
    });

    if (!machine) {
      throw new BadRequestException("Machine not found");
    }

    let totalMachineAmount = 0;

    const calculatedNozzles = dto.nozzles.map((n) => {
      const totalSellLiters =
        n.currentReading -
        n.lastReading -
        n.testingLiters -
        n.faultTestingLiters;

      const totalAmount = totalSellLiters * n.pricePerLiter;

      totalMachineAmount += totalAmount;

      return {
        ...n,
        totalSellLiters,
        totalAmount,
      };
    });

    const saved = await this.shiftModel.create({
      adminId: new Types.ObjectId(adminId),
      date: dto.date,
      shiftId: dto.shiftId,
      shiftNumber: dto.shiftNumber,
      machineId: machine._id,
      nozzles: calculatedNozzles,
      totalMachineAmount,
    });

    return {
      message: "Shift machine entry saved successfully",
      data: saved,
    };
  }
}
