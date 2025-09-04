import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Admin, AdminDocument } from "./admin.schema";
import { Model, Types } from "mongoose";
import { SelectPlanDto } from "../plan/plan.dto";
import { Plan, PlanDocument } from "../plan/plan.schema";

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

  async getProfile(user: {
    role: string;
    mobileNo: string;
    adminId?: string;
    sub: string;
  }) {
    if (user.role === "admin") {
      const adminDoc = await this.adminModel
        .findOne({ mobileNo: user.mobileNo })
        .populate("plan");

      if (!adminDoc) throw new NotFoundException("Admin not found");

      const admin = adminDoc as AdminDocument & { plan: Plan };

      return {
        role: "admin",
        data: {
          businessEmail: admin.businessEmail,
          businessName: admin.businessName,
          mobileNo: admin.mobileNo,
          startDate: admin.startDate,
          freeTrial: admin.freeTrial,
          freeTrialAttempt: admin.freeTrialAttempt,
          paidUser: admin.paidUser,
          activeAccount: admin.activeAccount,
          plan: {
            label: admin.plan?.label,
            type: admin.plan?.type,
            price: admin.plan?.price,
            period: admin.plan?.period,
          },
        },
      };
    }

    if (user.role === "manager" && user.adminId) {
      const adminDoc = await this.adminModel
        .findById(user.adminId)
        .populate("plan");

      if (!adminDoc) throw new NotFoundException("Admin (owner) not found");

      const admin = adminDoc as AdminDocument & { plan: Plan };

      const manager = admin.managers.find((m) => m.mobile === user.mobileNo);
      if (!manager) throw new NotFoundException("Manager not found");

      return {
        role: "manager",
        data: {
          manager: {
            name: manager.name,
            mobile: manager.mobile,
            shift: manager.shift,
          },
          admin: {
            businessEmail: admin.businessEmail,
            businessName: admin.businessName,
            freeTrial: admin.freeTrial,
            paidUser: admin.paidUser,
            activeAccount: admin.activeAccount,
            plan: {
              label: admin.plan?.label,
              type: admin.plan?.type,
              price: admin.plan?.price,
              period: admin.plan?.period,
            },
          },
        },
      };
    }

    throw new BadRequestException("Invalid role or user context");
  }

  async getFuelTypes(adminId: string | undefined) {
    const admin = await this.adminModel.findById(adminId).select("fuelTypes");

    if (!admin) {
      throw new Error("Admin not found");
    }

    return { fuelTypes: admin.fuelTypes };
  }
}
