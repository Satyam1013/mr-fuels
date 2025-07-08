/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/admin/admin.controller.ts
import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
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
    const adminId = req.user.sub;
    return this.adminService.selectPlan(adminId, dto);
  }

  @Get("profile")
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.adminService.getProfile(req.user);
  }
}
