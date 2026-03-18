import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Admin } from "../admin/admin.schema";
import { Plan } from "../plan-details/plan-details.schema";
import { Subscription } from "../subscription/subscription.schema";
import { PlanStatus } from "../plan-details/plan-details.enums";
import { SubscriptionStatus } from "../subscription/subscription.enum";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Plan.name) private planModel: Model<Plan>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
  ) {}

  async selectPlan(adminId: Types.ObjectId, planId: string) {
    const plan = await this.planModel.findById(planId);

    if (!plan) {
      throw new BadRequestException("Plan not found");
    }

    if (plan.status !== PlanStatus.ACTIVE) {
      throw new BadRequestException("Plan is not active");
    }

    const existingSubscription = await this.subscriptionModel.findOne({
      adminId,
      status: SubscriptionStatus.ACTIVE,
    });

    if (existingSubscription) {
      throw new BadRequestException("Active subscription already exists");
    }

    const startDate = new Date();
    const expiryDate = new Date(startDate);

    const trialEnabled = plan.trial?.enabled ?? false;
    const trialDays = plan.trial?.trialDays ?? 0;
    const durationMonths = plan.duration?.months ?? 0;

    if (trialEnabled && trialDays > 0) {
      expiryDate.setDate(expiryDate.getDate() + trialDays);
    } else {
      if (durationMonths <= 0) {
        throw new BadRequestException("Invalid plan duration");
      }

      expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
    }

    if (isNaN(expiryDate.getTime())) {
      throw new BadRequestException("Expiry calculation failed");
    }

    const subscription = await this.subscriptionModel.create({
      adminId,
      planId,
      startDate,
      expiryDate,
      status: SubscriptionStatus.ACTIVE,
    });

    await this.adminModel.findByIdAndUpdate(adminId, {
      currentSubscriptionId: subscription._id,
    });

    return {
      success: true,
      message: "Plan selected successfully",
    };
  }
}
