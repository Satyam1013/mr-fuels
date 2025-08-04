import { Body, Controller, Post } from "@nestjs/common";
import { SuperAdminService } from "./super-admin.service";
import { CreatePlanDto } from "../plan/plan.dto";

@Controller("super-admin")
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post("/add-plan")
  async addPlan(@Body() dto: CreatePlanDto) {
    return this.superAdminService.addPlan(dto);
  }
}
