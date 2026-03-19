import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PumpExpense } from "./pump-expense.schema";
import { CreatePumpExpenseDto } from "./pump-expense.dto";

@Injectable()
export class PumpExpenseService {
  constructor(
    @InjectModel(PumpExpense.name)
    private pumpExpenseModel: Model<PumpExpense>,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreatePumpExpenseDto) {
    const expense = new this.pumpExpenseModel({
      ...dto,
      adminId,
      machineId: new Types.ObjectId(dto.machineId),
    });

    return expense.save();
  }

  async findAll(adminId: Types.ObjectId) {
    return this.pumpExpenseModel
      .find({ adminId })
      .populate("machineId")
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    return this.pumpExpenseModel.findById(id).populate("machineId");
  }

  async remove(id: string) {
    return this.pumpExpenseModel.findByIdAndDelete(id);
  }
}
