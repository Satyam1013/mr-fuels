import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PumpExpense } from "./pump-expense.schema";
import { CreatePumpExpenseDto, UpdatePumpExpenseDto } from "./pump-expense.dto";

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
    return this.pumpExpenseModel
      .find({ adminId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(adminId: Types.ObjectId, id: string) {
    const record = await this.pumpExpenseModel
      .findOne({ _id: new Types.ObjectId(id), adminId })
      .lean();

    if (!record) {
      throw new NotFoundException(`Pump expense ${id} not found.`);
    }

    return record;
  }

  async update(adminId: Types.ObjectId, id: string, dto: UpdatePumpExpenseDto) {
    const updated = await this.pumpExpenseModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), adminId },
      {
        $set: {
          ...(dto.name && { name: dto.name }),
          ...(dto.date && { date: new Date(dto.date) }),
          ...(dto.shiftNumber && { shiftNumber: dto.shiftNumber }),
          ...(dto.amount && { amount: dto.amount }),
          ...(dto.category && { category: dto.category }),
          ...(dto.creditBy && {
            creditBy: new Types.ObjectId(dto.creditBy),
          }),
          ...(dto.narration !== undefined && { narration: dto.narration }),
          ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
        },
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException(`Pump expense ${id} not found.`);
    }

    return {
      message: "Pump expense updated successfully",
      data: updated,
    };
  }

  async remove(adminId: Types.ObjectId, id: string) {
    const deleted = await this.pumpExpenseModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!deleted) {
      throw new NotFoundException(`Pump expense ${id} not found.`);
    }

    return { message: "Pump expense deleted successfully" };
  }
}
