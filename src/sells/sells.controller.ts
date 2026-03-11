import { Controller, Get, Req } from "@nestjs/common";
import { SellsService } from "./sells.service";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("sells")
export class SellsController {
  constructor(private readonly sellsService: SellsService) {}

  @Get("dashboard-setup")
  async getDashboardSetup(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
    return this.sellsService.getDashboardSetup(adminId);
  }

  @Get("shift-dashboard")
  async getShiftDashboard(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
    return this.sellsService.getShiftDashboard(adminId);
  }
}
