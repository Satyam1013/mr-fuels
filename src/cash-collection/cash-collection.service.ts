import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CashCollection } from "./cash-collection.schema";
import {
  CreateCashCollectionDto,
  UpdateCashCollectionDto,
} from "./cash-collection.dto";

@Injectable()
export class CashCollectionService {
  constructor(
    @InjectModel(CashCollection.name)
    private cashCollectionModel: Model<CashCollection>,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateCashCollectionDto) {
    const cash = await this.cashCollectionModel.create({
      adminId,
      staffId: new Types.ObjectId(dto.staffId),
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
      .find({ adminId })
      .populate("staffId", "staffName")
      .sort({ createdAt: -1 })
      .lean();

    return { message: "Cash collections fetched successfully", data };
  }

  async findByShift(
    adminId: Types.ObjectId,
    date: string,
    shiftNumber: number,
  ) {
    const data = await this.cashCollectionModel
      .find({
        adminId,
        date: new Date(date),
        shiftNumber,
      })
      .populate("staffId", "staffName")
      .sort({ createdAt: -1 })
      .lean();

    return {
      message: "Cash collections fetched successfully",
      date,
      shiftNumber,
      totalEntries: data.length,
      totalCash: data.reduce((sum, d) => sum + (d.totalAmount || 0), 0),
      data,
    };
  }

  async findOne(adminId: Types.ObjectId, id: string) {
    const data = await this.cashCollectionModel
      .findOne({ _id: new Types.ObjectId(id), adminId })
      .populate("staffId", "staffName")
      .lean();

    if (!data) {
      throw new NotFoundException("Cash collection not found");
    }

    return { message: "Cash collection fetched successfully", data };
  }

  async update(
    adminId: Types.ObjectId,
    id: string,
    dto: UpdateCashCollectionDto,
  ) {
    const updated = await this.cashCollectionModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), adminId },
      {
        $set: {
          ...(dto.staffId && { staffId: new Types.ObjectId(dto.staffId) }),
          ...(dto.shiftNumber && { shiftNumber: dto.shiftNumber }),
          ...(dto.date && { date: new Date(dto.date) }),
          ...(dto.denominations && { denominations: dto.denominations }),
          ...(dto.totalAmount && { totalAmount: dto.totalAmount }),
        },
      },
      { new: true },
    );

    if (!updated) {
      throw new NotFoundException("Cash collection not found");
    }

    return { message: "Cash collection updated successfully", data: updated };
  }

  async remove(adminId: Types.ObjectId, id: string) {
    const deleted = await this.cashCollectionModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!deleted) {
      throw new NotFoundException("Cash collection not found");
    }

    return { message: "Cash collection deleted successfully" };
  }
}
