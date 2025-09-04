import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { DSR, DSRDocument } from "./dsr.schema";
import { CreateDSRDto } from "./dsr.dto";

@Injectable()
export class DSRService {
  constructor(
    @InjectModel(DSR.name) private readonly dsrModel: Model<DSRDocument>,
  ) {}

  async create(dto: CreateDSRDto, pumpId: string) {
    return this.dsrModel.create({
      ...dto,
      pumpId: new Types.ObjectId(pumpId),
      date: new Date(dto.date),
    });
  }
}
