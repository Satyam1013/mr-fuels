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
      creditBy: new Types.ObjectId(dto.creditBy),
      date: new Date(dto.date),
    });

    return expense.save();
  }

  async findAll(adminId: Types.ObjectId) {
    return this.pumpExpenseModel.find({ adminId }).sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    return this.pumpExpenseModel.findById(id);
  }

  async remove(id: string) {
    return this.pumpExpenseModel.findByIdAndDelete(id);
  }
}
