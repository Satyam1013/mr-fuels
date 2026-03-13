import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as bcrypt from "bcrypt";
import { Manager } from "./managers.schema";
import { Admin } from "../admin/admin.schema";
import { BulkCreateManagerDto, UpdateManagerDto } from "./managers.dto";

@Injectable()
export class ManagerService {
  constructor(
    @InjectModel(Manager.name)
    private managerModel: Model<Manager>,

    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
  ) {}

  async addManagers(adminId: string, payload: BulkCreateManagerDto) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    const { managers, numberOfManagers } = payload;

    if (numberOfManagers !== managers.length) {
      throw new ConflictException(
        `numberOfManagers (${numberOfManagers}) does not match managers length (${managers.length})`,
      );
    }

    const docs: Partial<Manager>[] = [];

    for (const dto of managers) {
      const existing = await this.managerModel.findOne({
        phone: dto.phone,
      });

      if (existing) {
        throw new ConflictException(
          `Manager with phone ${dto.phone} already exists`,
        );
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      docs.push({
        adminId: new Types.ObjectId(adminId),
        ...dto,
        password: hashedPassword,
      });
    }

    let insertedManagers: Manager[] = [];

    if (docs.length) {
      insertedManagers = (await this.managerModel.insertMany(
        docs,
      )) as Manager[];
    }

    return insertedManagers;
  }

  async getManagers(adminId: string) {
    return this.managerModel.find({ adminId: new Types.ObjectId(adminId) });
  }

  async updateManager(managerId: string, payload: UpdateManagerDto) {
    const manager = await this.managerModel.findById(managerId);
    if (!manager) throw new NotFoundException("Manager not found");

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }

    Object.assign(manager, payload);
    return manager.save();
  }

  async deleteManager(managerId: string) {
    const manager = await this.managerModel.findById(managerId);
    if (!manager) throw new NotFoundException("Manager not found");

    await this.managerModel.deleteOne({ _id: managerId });
    return { message: "Manager deleted successfully" };
  }
}
