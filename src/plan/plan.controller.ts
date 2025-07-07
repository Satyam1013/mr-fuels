import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { PlanService } from "./plan.service";
import { CreatePlanDto, UpdatePlanDto } from "./plan.dto";

@Controller("plans")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() dto: CreatePlanDto) {
    return this.planService.createPlan(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.updatePlan(id, dto);
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
