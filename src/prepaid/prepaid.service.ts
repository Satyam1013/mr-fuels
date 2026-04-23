import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Prepaid } from "./prepaid.schema";
import { CreatePrepaidDto } from "./prepaid.dto";
import { CustomerService } from "../customer/customer.service";

@Injectable()
export class PrepaidService {
  constructor(
    @InjectModel(Prepaid.name)
    private prepaidModel: Model<Prepaid>,

    private customerService: CustomerService,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreatePrepaidDto) {
    const customer = await this.customerService.findCustomerById(
      adminId,
      dto.customerId,
    );

    const saved = await this.prepaidModel.create({
      adminId,
      customerId: customer._id,
      amount: dto.amount,
      date: new Date(dto.date),
      shiftNumber: dto.shiftNumber,
      creditBy: new Types.ObjectId(dto.creditBy),
      mode: dto.mode,
      productType: dto.productType ?? null,
      fuelType: dto.fuelType ?? null,
      nonFuelProductId: dto.nonFuelProductId
        ? new Types.ObjectId(dto.nonFuelProductId)
        : null,
      quantity: dto.quantity ?? null,
      narration: dto.narration,
      photoUrl: dto.photoUrl,
    });

    return {
      message: "Prepaid entry added successfully",
      data: saved,
    };
  }

  async findAll(adminId: Types.ObjectId) {
    return this.prepaidModel
      .find({ adminId })
      .populate("customerId", "name phoneNumber")
      .lean();
  }
}
