import { Controller, Get, Req } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("sales")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get("dashboard-setup")
  async getDashboardSetup(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
    return this.salesService.getDashboardSetup(adminId);
  }

  @Get("shift-dashboard")
  async getShiftDashboard(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
    return this.salesService.getShiftDashboard(adminId);
  }
}
