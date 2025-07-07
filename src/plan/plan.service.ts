// src/plan/plan.service.ts

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Plan, PlanDocument } from "./plan.schema";
import { CreatePlanDto, UpdatePlanDto } from "./plan.dto";

@Injectable()
export class PlanService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}

  async createPlan(dto: CreatePlanDto) {
    return this.planModel.create(dto);
  }

  async updatePlan(id: string, dto: UpdatePlanDto) {
    const plan = await this.planModel.findByIdAndUpdate(id, dto, { new: true });
    if (!plan) throw new NotFoundException("Plan not found");
    return plan;
  }

  async getAllPlans() {
    return this.planModel.find({ isActive: true });
  }

  async getPlanByType(type: string) {
    return this.planModel.findOne({ type });
  }
}
