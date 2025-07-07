// src/admin/admin.controller.ts
import { Body, Controller, Patch, Req, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "src/auth/auth.guard";
import { SelectPlanDto } from "src/plan/plan.dto";
import { AuthenticatedRequest } from "src/auth/auth.request";

@UseGuards(AuthGuard)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch("plan")
  async updatePlan(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SelectPlanDto,
  ) {
    const adminId = req.user._id;
    return this.adminService.selectPlan(adminId, dto);
  }
}
