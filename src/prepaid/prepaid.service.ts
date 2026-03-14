import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Prepaid } from "./prepaid.schema";
import { CreatePrepaidDto } from "./prepaid.dto";
import { Machine } from "../machines/machines.schema";
import { CustomerService } from "../customer/customer.service";

@Injectable()
export class PrepaidService {
  constructor(
    @InjectModel(Prepaid.name)
    private prepaidModel: Model<Prepaid>,

    @InjectModel(Machine.name)
    private machineModel: Model<Machine>,

    private customerService: CustomerService,
  ) {}

  async create(adminId: string, dto: CreatePrepaidDto) {
    const machine = await this.machineModel.findOne({
      _id: new Types.ObjectId(dto.machineId),
      adminId: new Types.ObjectId(adminId),
    });

    if (!machine) {
      throw new BadRequestException("Machine not found");
    }

    const nozzle = machine.nozzle.find(
      (n) => n.nozzleNumber === dto.nozzleNumber && n.isActive,
    );

    if (!nozzle) {
      throw new BadRequestException("Invalid nozzle number");
    }

    const customer = await this.customerService.findOrCreateCustomer(
      adminId,
      dto.partyName,
      dto.phoneNumber,
    );

    const saved = await this.prepaidModel.create({
      adminId: new Types.ObjectId(adminId),
      customerId: customer._id,
      machineId: new Types.ObjectId(dto.machineId),
      nozzleNumber: dto.nozzleNumber,
      partyName: dto.partyName,
      phoneNumber: dto.phoneNumber,
      amount: dto.amount,
      date: new Date(dto.date),
      shiftNumber: dto.shiftNumber,
      creditBy: dto.creditBy,
      narration: dto.narration,
      photoUrl: dto.photoUrl,
    });

    return {
      message: "Prepaid entry added successfully",
      data: saved,
    };
  }

  async findAll(adminId: string) {
    return this.prepaidModel.find({
      adminId: new Types.ObjectId(adminId),
    });
  }
}
