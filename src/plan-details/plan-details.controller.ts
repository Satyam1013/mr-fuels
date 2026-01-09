import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { PlanService } from "./plan-details.service";
import { PlanDetailsDto } from "./plan-details.dto";
import { Plan } from "./plan-details.schema";

@Controller("plans")
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() planDetailsDto: PlanDetailsDto): Promise<Plan> {
    return this.planService.create(planDetailsDto);
  }

  @Get()
  findAll(): Promise<Plan[]> {
    return this.planService.findAll();
  }

  @Get(":name")
  findByName(@Param("name") name: string): Promise<Plan | null> {
    return this.planService.findByName(name);
  }
}
