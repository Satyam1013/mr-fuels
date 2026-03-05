import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CashCollection } from "./cash-collection.schema";
import { Machine } from "../machines/machines.schema";
import { CreateCashCollectionDto } from "./cash-collection.dto";

@Injectable()
export class CashCollectionService {
  constructor(
    @InjectModel(CashCollection.name)
    private cashCollectionModel: Model<CashCollection>,

    @InjectModel(Machine.name)
    private machineModel: Model<Machine>,
  ) {}

  async create(adminId: string, dto: CreateCashCollectionDto) {
    const machine = await this.machineModel.findOne({
      _id: new Types.ObjectId(dto.machineId),
      adminId: new Types.ObjectId(adminId),
    });

    if (!machine) {
      throw new BadRequestException("Machine not found");
    }

    const nozzle = machine.nozzle.find(
      (n) => n.nozzleNumber === dto.nozzleNumber && n.isActive,
    );

    if (!nozzle) {
      throw new BadRequestException("Invalid nozzle number");
    }

    const cash = await this.cashCollectionModel.create({
      adminId: new Types.ObjectId(adminId),
      machineId: new Types.ObjectId(dto.machineId),
      nozzleNumber: dto.nozzleNumber,
      shiftNumber: dto.shiftNumber,
      date: new Date(dto.date),
      denominations: dto.denominations,
      totalAmount: dto.totalAmount,
    });

    return {
      message: "Cash collection saved successfully",
      data: cash,
    };
  }
}
