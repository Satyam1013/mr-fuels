import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { PlanService } from "./plan-details.service";
import { PlanDetailsDto } from "./plan-details.dto";
import { Plan } from "./plan-details.schema";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("plans")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() planDetailsDto: PlanDetailsDto): Promise<Plan> {
    return this.planService.create(planDetailsDto);
  }

  @Get()
  findAll(@GetUser("adminId") adminId: Types.ObjectId): Promise<any> {
    return this.planService.findAll(adminId);
  }

  @Get(":name")
  findByName(@Param("name") name: string): Promise<Plan | null> {
    return this.planService.findByName(name);
  }
}
