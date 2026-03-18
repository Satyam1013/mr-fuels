import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpiPayment } from "./payment.schema";
import { SubmitUpiDto } from "./payment.dto";

@Injectable()
export class UpiService {
  constructor(
    @InjectModel(UpiPayment.name)
    private upiModel: Model<UpiPayment>,
  ) {}

  async submitUpiPayments(
    adminId: Types.ObjectId,
    dto: SubmitUpiDto,
    files: Express.Multer.File[],
  ) {
    const { date, shiftId, upiPayments } = dto;

    const formattedPayments = upiPayments.map((payment, index) => ({
      appName: payment.appName,
      amount: payment.amount,
      attachmentUrl: files[index] ? `/uploads/${files[index].filename}` : "",
    }));

    const saved = await this.upiModel.create({
      adminId,
      date,
      shiftId,
      upiPayments: formattedPayments,
    });

    return {
      message: "UPI payments saved successfully",
      data: saved,
    };
  }
}
