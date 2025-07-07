import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Plan, PlanDocument } from "./plan.schema";

@Injectable()
export class PlanService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}

  async getAllPlans() {
    return this.planModel.find({ isActive: true });
  }

  async getPlanByType(type: string) {
    return this.planModel.findOne({ type });
  }
}
