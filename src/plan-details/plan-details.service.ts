import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Plan, PlanDocument } from "./plan-details.schema";
import { PlanDetailsDto } from "./plan-details.dto";
import { DurationType } from "./plan-details.enums";
import { Subscription } from "../subscription/subscription.schema";

@Injectable()
export class PlanService {
  constructor(
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
  ) {}

  private formatName(plan: Plan) {
    if (plan.duration.durationType === DurationType.YEARLY) {
      return `${plan.name.toUpperCase()} Yearly`;
    }
    if (plan.duration.durationType === DurationType.MONTHLY) {
      return `${plan.name.toUpperCase()} Monthly`;
    }
    return `${plan.name.toUpperCase()} Trial`;
  }

  private getDurationLabel(plan: Plan) {
    if (plan.duration.durationType === DurationType.YEARLY) {
      return "1 Year";
    }
    if (plan.duration.durationType === DurationType.MONTHLY) {
      return `${plan.duration.months} Month`;
    }
    return "Trial";
  }

  private getHighlightTag(plan: Plan) {
    if (plan.tags?.mostPopular) return "Popular";
    if (plan.tags?.discounted) return "Best Value";
    if (plan.tags?.freeTrial) return "Free Trial";
    return "";
  }

  async create(planDetailsDto: PlanDetailsDto): Promise<Plan> {
    const plan = new this.planModel(planDetailsDto);
    return plan.save();
  }

  async findAll(adminId: string) {
    // 🔎 Check if user has already used trial
    const usedTrial = await this.subscriptionModel.exists({
      adminId,
      isTrial: true,
    });

    const plans = await this.planModel.find({ status: "active" }).lean();

    const quarterly: any[] = [];
    const yearly: any[] = [];

    for (const plan of plans) {
      // 🚫 Skip trial plan if already used
      if (plan.duration.durationType === DurationType.TRIAL && usedTrial) {
        continue;
      }

      const formatted = {
        planId: plan._id,
        code: plan.name,
        name: this.formatName(plan),
        description: plan.description,
        price: `₹${plan.pricing.finalPrice}`,
        durationLabel: this.getDurationLabel(plan),
        highlightTag: this.getHighlightTag(plan),
      };

      if (plan.duration.durationType === DurationType.YEARLY) {
        yearly.push(formatted);
      } else {
        quarterly.push(formatted);
      }
    }

    return { quarterly, yearly };
  }

  async findByName(name: string): Promise<Plan | null> {
    return this.planModel.findOne({ name }).exec();
  }
}
