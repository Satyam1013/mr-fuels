import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Admin, AdminDocument } from "./admin.schema";
import { Model } from "mongoose";
import { SelectPlanDto, PlanType } from "./admin.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
  ) {}

  async selectPlan(adminId: string, dto: SelectPlanDto) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) throw new NotFoundException("Admin not found");

    const now = new Date();
    let expiresAt: Date | null = null;

    switch (dto.plan) {
      case PlanType.FREE:
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        admin.planType = "free";
        admin.paidUser = false;
        admin.activeAccount = true;
        admin.freeTrial = true;
        break;

      case PlanType.MONTHLY:
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        admin.planType = "paid";
        admin.paidUser = true;
        admin.activeAccount = true;
        admin.freeTrial = false;
        break;

      case PlanType.YEARLY:
        expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        admin.planType = "paid";
        admin.paidUser = true;
        admin.activeAccount = true;
        admin.freeTrial = false;
        break;

      default:
        throw new BadRequestException("Invalid plan type");
    }

    admin.planExpiresAt = expiresAt;
    await admin.save();

    return {
      message: `Plan updated to ${dto.plan}`,
      expiresAt,
    };
  }
}
