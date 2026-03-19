import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Staff } from "./staff.schema";
import { Admin } from "../admin/admin.schema";
import { BulkCreateStaffDto, UpdateStaffDto } from "./staff.dto";

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name)
    private staffModel: Model<Staff>,

    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
  ) {}

  async addStaff(adminId: Types.ObjectId, payload: BulkCreateStaffDto) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    const { staff, numberOfStaff } = payload;

    if (numberOfStaff !== staff.length) {
      throw new ConflictException(
        `numberOfStaff (${numberOfStaff}) does not match staff array length (${staff.length})`,
      );
    }

    const docs = [];

    for (const dto of staff) {
      const existing = await this.staffModel.findOne({
        adminId,
        staffNumber: dto.staffNumber,
      });

      if (existing) {
        throw new ConflictException(
          `Staff with number ${dto.staffNumber} already exists`,
        );
      }

      docs.push({
        adminId,
        ...dto,
      });
    }

    if (docs.length) {
      return await this.staffModel.insertMany(docs);
    }

    return [];
  }

  async getStaff(adminId: Types.ObjectId) {
    return this.staffModel.find({ adminId });
  }

  async updateStaff(
    adminId: Types.ObjectId,
    staffId: string,
    dto: UpdateStaffDto,
  ) {
    const staff = await this.staffModel.findById(staffId);
    if (!staff) throw new NotFoundException("Staff not found");

    if (staff.adminId !== adminId) {
      throw new ConflictException(
        "Staff does not belong to the specified admin",
      );
    }

    Object.assign(staff, dto);
    return staff.save();
  }

  async removeStaff(adminId: Types.ObjectId, staffId: string) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    const staff = await this.staffModel.findById(staffId);
    if (!staff) {
      throw new NotFoundException("Staff not found");
    }

    if (staff.adminId !== adminId) {
      throw new ConflictException(
        "Staff does not belong to the specified admin",
      );
    }

    return await this.staffModel.findByIdAndDelete(staffId);
  }
}
