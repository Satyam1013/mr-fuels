import { Controller, Get, Post, Body, Param, Req } from "@nestjs/common";
import { PlanService } from "./plan-details.service";
import { PlanDetailsDto } from "./plan-details.dto";
import { Plan } from "./plan-details.schema";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("plans")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() planDetailsDto: PlanDetailsDto): Promise<Plan> {
    return this.planService.create(planDetailsDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest): Promise<any> {
    const adminId = req.user.adminId;
    return this.planService.findAll(adminId);
  }

  @Get(":name")
  findByName(@Param("name") name: string): Promise<Plan | null> {
    return this.planService.findByName(name);
  }
}
