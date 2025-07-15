import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Plan, PlanDocument } from "../plan/plan.schema";
import { CreatePlanDto } from "./super-admin.dto";

@Injectable()
export class SuperAdminService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}

  async addPlan(dto: CreatePlanDto) {
    const existing = await this.planModel.findOne({ label: dto.label });
    if (existing) {
      throw new BadRequestException("Plan with this label already exists");
    }

    const newPlan = new this.planModel(dto);
    await newPlan.save();

    return {
      message: "Plan created successfully",
      data: newPlan,
    };
  }
}
