import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  CreateDigitalPaymentDto,
  UpdateDigitalPaymentDto,
} from "./digital-payment.dto";
import { DigitalPayment } from "./digital-payment.schema";

@Injectable()
export class DigitalPaymentService {
  constructor(
    @InjectModel(DigitalPayment.name)
    private digitalPaymentModel: Model<DigitalPayment>,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateDigitalPaymentDto) {
    const data = new this.digitalPaymentModel({
      ...dto,
      adminId,
    });

    return data.save();
  }

  async findAll(adminId: Types.ObjectId) {
    return this.digitalPaymentModel.find({
      adminId,
    });
  }

  async findByShift(adminId: Types.ObjectId, date: string, shiftId: number) {
    return this.digitalPaymentModel.find({
      adminId,
      date,
      shiftId,
    });
  }

  async update(
    adminId: Types.ObjectId,
    id: string,
    dto: UpdateDigitalPaymentDto,
  ) {
    const existing = await this.digitalPaymentModel.findOne({
      _id: id,
      adminId,
    });

    if (!existing) {
      throw new NotFoundException("Digital payment record not found");
    }

    const updated = await this.digitalPaymentModel
      .findByIdAndUpdate(id, { $set: dto }, { new: true })
      .lean();

    return updated;
  }
}
