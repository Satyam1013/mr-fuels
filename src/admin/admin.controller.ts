import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "../auth/auth.guard";
import { SelectPlanDto } from "../plan/plan.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

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
