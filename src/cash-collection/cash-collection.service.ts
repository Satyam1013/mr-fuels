import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CashCollection } from "./cash-collection.schema";
import { Machine } from "../machines/machines.schema";
import {
  CreateCashCollectionDto,
  UpdateCashCollectionDto,
} from "./cash-collection.dto";

@Injectable()
export class CashCollectionService {
  constructor(
    @InjectModel(CashCollection.name)
    private cashCollectionModel: Model<CashCollection>,

    @InjectModel(Machine.name)
    private machineModel: Model<Machine>,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateCashCollectionDto) {
    const machine = await this.machineModel.findOne({
      _id: new Types.ObjectId(dto.machineId),
      adminId,
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
      adminId,
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

  async findAll(adminId: Types.ObjectId) {
    const data = await this.cashCollectionModel
      .find({
        adminId,
      })
      .sort({ createdAt: -1 });

    return {
      message: "Cash collections fetched successfully",
      data,
    };
  }

  async findOne(adminId: Types.ObjectId, id: string) {
    const data = await this.cashCollectionModel.findOne({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!data) {
      throw new BadRequestException("Cash collection not found");
    }

    return {
      message: "Cash collection fetched successfully",
      data,
    };
  }

  async update(
    adminId: Types.ObjectId,
    id: string,
    dto: UpdateCashCollectionDto,
  ) {
    const existing = await this.cashCollectionModel.findOne({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) {
      throw new BadRequestException("Cash collection not found");
    }

    const updated = await this.cashCollectionModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        ...(dto.machineId && { machineId: new Types.ObjectId(dto.machineId) }),
        ...(dto.date && { date: new Date(dto.date) }),
      },
      { new: true },
    );

    return {
      message: "Cash collection updated successfully",
      data: updated,
    };
  }

  async remove(adminId: Types.ObjectId, id: string) {
    const existing = await this.cashCollectionModel.findOne({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) {
      throw new BadRequestException("Cash collection not found");
    }

    await this.cashCollectionModel.findByIdAndDelete(id);

    return {
      message: "Cash collection deleted successfully",
    };
  }
}
