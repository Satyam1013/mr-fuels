import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Creditor } from "./creditors.schema";
import { CreateCreditorDto } from "./creditors.dto";
import { CustomerService } from "../customer/customer.service";
import { CreditStatusEnum } from "./creditors.enum";

@Injectable()
export class CreditorService {
  constructor(
    @InjectModel(Creditor.name)
    private creditorModel: Model<Creditor>,

    private customerService: CustomerService,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateCreditorDto) {
    try {
      const customer = await this.customerService.findCustomerById(
        adminId,
        dto.customerId,
      );

      const saved = await this.creditorModel.create({
        adminId,
        customerId: customer._id,
        creditDate: dto.creditDate ? new Date(dto.creditDate) : new Date(),
        returnDate: dto.returnDate ? new Date(dto.returnDate) : undefined,
        shiftNumber: dto.shiftNumber,
        amount: dto.amount,
        creditBy: new Types.ObjectId(dto.creditBy),
        narration: dto.narration,
        photoUrl: dto.photoUrl,
        creditStatus: dto.creditStatus ?? CreditStatusEnum.TAKEN,
        returnPaymentMode: dto.returnPaymentMode ?? null,
      });

      return {
        message: "Credit entry added successfully",
        data: saved,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll(adminId: Types.ObjectId) {
    return this.creditorModel
      .find({ adminId })
      .populate("customerId", "name phoneNumber")
      .lean();
  }
}
