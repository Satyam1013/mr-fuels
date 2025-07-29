import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Plan, PlanDocument } from "./plan.schema";
import { CreatePlanDto } from "./plan.dto";

@Injectable()
export class PlanService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}

  async createPlan(dto: CreatePlanDto) {
    return this.planModel.create(dto);
  }

  async getAllPlans() {
    return this.planModel.find({ isActive: true });
  }

  async getPlanByType(type: string) {
    return this.planModel.findOne({ type });
  }
}
