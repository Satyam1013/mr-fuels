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
import { BulkCreateManagerDto } from "./managers.dto";

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
}
