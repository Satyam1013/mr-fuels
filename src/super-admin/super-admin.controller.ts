import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { SuperAdminService } from "./super-admin.service";
import { CreatePlanDto } from "./super-admin.dto";

@UseGuards(AuthGuard)
@Controller("super-admin")
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Post("/add-plan")
  async addPlan(@Body() dto: CreatePlanDto) {
    return this.superAdminService.addPlan(dto);
  }
}
