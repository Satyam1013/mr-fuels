import { Controller, Get, Param } from "@nestjs/common";
import { PlanService } from "./plan.service";

@Controller("plans")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  findAll() {
    return this.planService.getAllPlans();
  }

  @Get(":type")
  findByType(@Param("type") type: string) {
    return this.planService.getPlanByType(type);
  }
}
