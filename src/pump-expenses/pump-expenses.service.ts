import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PumpExpense, PumpExpenseDocument } from "./pump-expenses.schema";
import {
  CreatePumpExpenseDto,
  UpdatePumpExpenseDto,
} from "./pump-expenses.dto";

@Injectable()
export class PumpExpenseService {
  constructor(
    @InjectModel(PumpExpense.name)
    private readonly pumpExpenseModel: Model<PumpExpenseDocument>,
  ) {}

  async create(dto: CreatePumpExpenseDto) {
    return this.pumpExpenseModel.create(dto);
  }

  async findAll() {
    return this.pumpExpenseModel.find().sort({ date: -1 });
  }

  async findById(id: string) {
    const doc = await this.pumpExpenseModel.findById(id);
    if (!doc) throw new NotFoundException("Expense not found");
    return doc;
  }

  async update(id: string, dto: UpdatePumpExpenseDto) {
    const updated = await this.pumpExpenseModel.findByIdAndUpdate(
      id,
      { $set: { entries: dto.entries } },
      { new: true },
    );
    if (!updated) throw new NotFoundException("Expense not found");
    return updated;
  }

  async delete(id: string) {
    const deleted = await this.pumpExpenseModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException("Expense not found");
    return { message: "Expense deleted successfully" };
  }
}
