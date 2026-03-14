import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Creditor } from "./creditors.schema";
import { CreateCreditorDto } from "./creditors.dto";
import { Machine } from "../machines/machines.schema";
import { CustomerService } from "../customer/customer.service";

@Injectable()
export class CreditorService {
  constructor(
    @InjectModel(Creditor.name)
    private creditorModel: Model<Creditor>,

    @InjectModel(Machine.name)
    private machineModel: Model<Machine>,

    private customerService: CustomerService,
  ) {}

  async create(adminId: string, dto: CreateCreditorDto) {
    try {
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
        dto.creditorName,
        dto.phoneNumber,
      );

      const saved = await this.creditorModel.create({
        adminId: new Types.ObjectId(adminId),
        customerId: customer._id,
        machineId: new Types.ObjectId(dto.machineId),
        nozzleNumber: dto.nozzleNumber,
        creditorName: dto.creditorName,
        date: new Date(dto.date),
        shiftNumber: dto.shiftNumber,
        amount: dto.amount,
        creditBy: dto.creditBy,
        phoneNumber: dto.phoneNumber,
        narration: dto.narration,
        photoUrl: dto.photoUrl,
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

  async findAll(adminId: string) {
    return this.creditorModel.find({
      adminId: new Types.ObjectId(adminId),
    });
  }
}
