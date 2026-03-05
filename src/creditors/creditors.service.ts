import {
  BadRequestException,
  ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Creditor } from "./creditors.schema";
import { CreateCreditorDto } from "./creditors.dto";
import { Machine } from "../machines/machines.schema";

@Injectable()
export class CreditorService {
  constructor(
    @InjectModel(Creditor.name)
    private creditorModel: Model<Creditor>,

    @InjectModel(Machine.name)
    private machineModel: Model<Machine>,
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

      const saved = await this.creditorModel.create({
        adminId: new Types.ObjectId(adminId),
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
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: number }).code === 11000
      ) {
        throw new ConflictException("Phone number already exists");
      }

      throw error;
    }
  }

  async findAll(adminId: string) {
    return this.creditorModel.find({
      adminId: new Types.ObjectId(adminId),
    });
  }
}
