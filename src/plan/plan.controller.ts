import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { CreatePlanDto } from "./plan.dto";

@Controller("plans")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() dto: CreatePlanDto) {
    return this.planService.createPlan(dto);
  }

  @Get()
  findAll() {
    return this.planService.getAllPlans();
  }

  @Get(":type")
  findByType(@Param("type") type: string) {
    return this.planService.getPlanByType(type);
  }
}
