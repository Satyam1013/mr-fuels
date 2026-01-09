import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Plan, PlanDocument } from "./plan-details.schema";
import { PlanDetailsDto } from "./plan-details.dto";

@Injectable()
export class PlanService {
  constructor(@InjectModel(Plan.name) private planModel: Model<PlanDocument>) {}

  async create(planDetailsDto: PlanDetailsDto): Promise<Plan> {
    const plan = new this.planModel(planDetailsDto);
    return plan.save();
  }

  async findAll(): Promise<Plan[]> {
    return this.planModel.find().exec();
  }

  async findByName(name: string): Promise<Plan | null> {
    return this.planModel.findOne({ name }).exec();
  }
}
