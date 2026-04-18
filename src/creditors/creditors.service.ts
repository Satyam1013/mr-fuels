import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Creditor } from "./creditors.schema";
import { CreateCreditorDto } from "./creditors.dto";
import { Machine } from "../machines/machines.schema";
import { CustomerService } from "../customer/customer.service";
import { CreditStatusEnum } from "./creditors.enum";

@Injectable()
export class CreditorService {
  constructor(
    @InjectModel(Creditor.name)
    private creditorModel: Model<Creditor>,

    @InjectModel(Machine.name)
    private machineModel: Model<Machine>,

    private customerService: CustomerService,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateCreditorDto) {
    try {
      const machine = await this.machineModel.findOne({
        _id: new Types.ObjectId(dto.machineId),
        adminId,
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

      const customer = await this.customerService.findCustomerById(
        adminId,
        dto.customerId,
      );

      const saved = await this.creditorModel.create({
        adminId,
        customerId: customer._id,
        machineId: new Types.ObjectId(dto.machineId),
        nozzleNumber: dto.nozzleNumber,
        creditDate: dto.creditDate ? new Date(dto.creditDate) : new Date(),
        returnDate: dto.returnDate ? new Date(dto.returnDate) : undefined,
        shiftNumber: dto.shiftNumber,
        amount: dto.amount,
        creditBy: dto.creditBy,
        narration: dto.narration,
        photoUrl: dto.photoUrl,
        creditStatus: dto.creditStatus ?? CreditStatusEnum.TAKEN,
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
