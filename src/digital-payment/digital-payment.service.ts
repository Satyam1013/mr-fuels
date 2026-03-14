import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateDigitalPaymentDto } from "./digital-payment.dto";
import { DigitalPayment } from "./digital-payment.schema";

@Injectable()
export class DigitalPaymentService {
  constructor(
    @InjectModel(DigitalPayment.name)
    private digitalPaymentModel: Model<DigitalPayment>,
  ) {}

  async create(adminId: string, dto: CreateDigitalPaymentDto) {
    const data = new this.digitalPaymentModel({
      ...dto,
      adminId: new Types.ObjectId(adminId),
    });

    return data.save();
  }

  async findAll(adminId: string) {
    return this.digitalPaymentModel.find({
      adminId: new Types.ObjectId(adminId),
    });
  }

  async findByShift(adminId: string, date: string, shiftId: number) {
    return this.digitalPaymentModel.find({
      adminId: new Types.ObjectId(adminId),
      date,
      shiftId,
    });
  }
}
