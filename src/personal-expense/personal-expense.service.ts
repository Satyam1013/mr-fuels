import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PersonalExpense } from "./personal-expense.schema";
import {
  CreatePersonalExpenseDto,
  UpdatePersonalExpenseDto,
} from "./personal-expense.dto";

@Injectable()
export class PersonalExpenseService {
  constructor(
    @InjectModel(PersonalExpense.name)
    private personalExpenseModel: Model<PersonalExpense>,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreatePersonalExpenseDto) {
    const expense = new this.personalExpenseModel({
      ...dto,
      adminId,
      creditBy: new Types.ObjectId(dto.creditBy),
      date: new Date(dto.date),
    });

    return expense.save();
  }

  async findAll(adminId: Types.ObjectId) {
    return this.personalExpenseModel
      .find({ adminId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(adminId: Types.ObjectId, id: string) {
    const record = await this.personalExpenseModel
      .findOne({ _id: new Types.ObjectId(id), adminId })
      .lean();

    if (!record) {
      throw new NotFoundException(`Personal expense ${id} not found.`);
    }

    return record;
  }

  async patch(
    adminId: Types.ObjectId,
    id: string,
    dto: UpdatePersonalExpenseDto,
  ) {
    const updated = await this.personalExpenseModel.findOneAndUpdate(
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
      throw new NotFoundException(`Personal expense ${id} not found.`);
    }

    return {
      message: "Personal expense updated successfully",
      data: updated,
    };
  }

  async remove(adminId: Types.ObjectId, id: string) {
    const deleted = await this.personalExpenseModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!deleted) {
      throw new NotFoundException(`Personal expense ${id} not found.`);
    }

    return { message: "Personal expense deleted successfully" };
  }
}
