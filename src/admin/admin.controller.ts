import { Body, Controller, Patch, Req } from "@nestjs/common";
import { SelectPlanDto } from "./admin.dto";
import { AdminService } from "./admin.service";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch("select-plan")
  selectPlan(@Req() req: AuthenticatedRequest, @Body() dto: SelectPlanDto) {
    return this.adminService.selectPlan(req.user.adminId, dto.planId);
  }
}
