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
import { CreateManagerDto } from "./managers.dto";

@Injectable()
export class ManagerService {
  constructor(
    @InjectModel(Manager.name)
    private managerModel: Model<Manager>,

    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
  ) {}

  async addManager(adminId: string, dto: CreateManagerDto) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    // optional: same admin ke under duplicate phone avoid
    const existing = await this.managerModel.findOne({
      adminId,
      phone: dto.phone,
    });

    if (existing) {
      throw new ConflictException("Manager with this phone already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.managerModel.create({
      adminId: new Types.ObjectId(adminId),
      ...dto,
      password: hashedPassword,
    });
  }
}
