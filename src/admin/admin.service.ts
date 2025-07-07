import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Admin, AdminDocument } from "./admin.schema";
import { Model, Types } from "mongoose";
import { SelectPlanDto } from "src/plan/plan.dto";
import { Plan, PlanDocument } from "src/plan/plan.schema";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
  ) {}

  async selectPlan(adminId: string, dto: SelectPlanDto) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) throw new NotFoundException("Admin not found");

    const selectedPlan = await this.planModel.findById(dto.planId);
    if (!selectedPlan) throw new BadRequestException("Invalid plan selected");

    // Set plan reference
    admin.plan = selectedPlan._id as Types.ObjectId;

    const now = new Date();
    let expiresAt: Date;

    // Set expiry based on plan type
    switch (selectedPlan.type) {
      case "free":
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        admin.freeTrial = true;
        admin.paidUser = false;
        break;

      case "monthly":
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        admin.freeTrial = false;
        admin.paidUser = true;
        break;

      case "quarterly":
        expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
        admin.freeTrial = false;
        admin.paidUser = true;
        break;

      case "yearly":
        expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days
        admin.freeTrial = false;
        admin.paidUser = true;
        break;

      default:
        throw new BadRequestException("Unknown plan type");
    }

    admin.planExpiresAt = expiresAt;
    admin.activeAccount = true;
    await admin.save();

    return {
      message: `Plan updated to ${selectedPlan.label}`,
      expiresAt,
    };
  }
}
