import { Controller, Get } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("sales")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get("dashboard-setup")
  async getDashboardSetup(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.salesService.getDashboardSetup(adminId);
  }

  @Get("shift-dashboard")
  async getShiftDashboard(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.salesService.getShiftDashboard(adminId);
  }
}
