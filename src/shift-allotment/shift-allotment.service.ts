import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { ShiftAllotment } from "./shift-allotment.schema";
import {
  CreateShiftAllotmentDto,
  UpdateShiftAllotmentDto,
} from "./shift-allotment.dto";

@Injectable()
export class ShiftAllotmentService {
  constructor(
    @InjectModel(ShiftAllotment.name)
    private shiftAllotmentModel: Model<ShiftAllotment>,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateShiftAllotmentDto) {
    const existing = await this.shiftAllotmentModel.findOne({
      adminId,
      shiftId: dto.shiftId,
    });

    if (existing) {
      throw new ConflictException(
        `Shift allotment for shiftId "${dto.shiftId}" already exists`,
      );
    }

    return this.shiftAllotmentModel.create({
      ...dto,
      adminId,
      managers: dto.managers.map((id) => new Types.ObjectId(id)),
      machines: dto.machines.map((m) => ({
        ...m,
        nozzles: m.nozzles.map((n) => ({
          ...n,
          staffId: new Types.ObjectId(n.staffId),
          inactiveStatus: n.inactiveStatus ?? null,
        })),
      })),
    });
  }

  async findAll(adminId: Types.ObjectId) {
    return this.shiftAllotmentModel
      .find({ adminId })
      .populate("managers", "managerName phone")
      .lean();
  }

  async findOne(adminId: Types.ObjectId, id: string) {
    const doc = await this.shiftAllotmentModel
      .findOne({ _id: new Types.ObjectId(id), adminId })
      .populate("managers", "managerName phone")
      .lean();

    if (!doc) throw new NotFoundException("Shift allotment not found");
    return doc;
  }

  async update(
    adminId: Types.ObjectId,
    id: string,
    dto: UpdateShiftAllotmentDto,
  ) {
    const existing = await this.shiftAllotmentModel.findOne({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) throw new NotFoundException("Shift allotment not found");

    if (dto.managers) {
      existing.managers = dto.managers.map((m) => new Types.ObjectId(m));
    }

    if (dto.machines) {
      existing.machines = dto.machines.map((m) => ({
        machineId: m.machineId,
        nozzles: m.nozzles.map((n) => ({
          nozzleId: n.nozzleId,
          staffId: new Types.ObjectId(n.staffId),
          nozzleStatus: n.nozzleStatus,
          inactiveStatus: n.inactiveStatus ?? null,
        })),
      }));
    }

    if (dto.shiftId) existing.shiftId = dto.shiftId;

    return existing.save();
  }

  async remove(adminId: Types.ObjectId, id: string) {
    const doc = await this.shiftAllotmentModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!doc) throw new NotFoundException("Shift allotment not found");
    return { deleted: true };
  }
}
