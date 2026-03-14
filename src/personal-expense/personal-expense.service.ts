import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PersonalExpense } from "./personal-expense.schema";
import { CreatePersonalExpenseDto } from "./personal-expense.dto";

@Injectable()
export class PersonalExpenseService {
  constructor(
    @InjectModel(PersonalExpense.name)
    private personalExpenseModel: Model<PersonalExpense>,
  ) {}

  async create(adminId: string, dto: CreatePersonalExpenseDto) {
    const expense = new this.personalExpenseModel({
      ...dto,
      adminId: new Types.ObjectId(adminId),
      machineId: new Types.ObjectId(dto.machineId),
    });

    return expense.save();
  }

  async findAll(adminId: string) {
    return this.personalExpenseModel
      .find({ adminId: new Types.ObjectId(adminId) })
      .sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    return this.personalExpenseModel.findById(id);
  }

  async remove(id: string) {
    return this.personalExpenseModel.findByIdAndDelete(id);
  }
}
