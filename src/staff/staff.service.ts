import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Staff } from "./staff.schema";
import { Admin } from "../admin/admin.schema";
import { CreateStaffDto } from "./staff.dto";

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name)
    private staffModel: Model<Staff>,

    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
  ) {}

  async addStaff(adminId: string, dto: CreateStaffDto) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    const existing = await this.staffModel.findOne({
      adminId,
      staffNumber: dto.staffNumber,
    });

    if (existing) {
      throw new ConflictException("Staff with this number already exists");
    }

    return this.staffModel.create({
      adminId: new Types.ObjectId(adminId),
      ...dto,
    });
  }
}
