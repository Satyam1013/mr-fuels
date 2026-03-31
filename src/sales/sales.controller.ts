import { Controller, Get, Query } from "@nestjs/common";
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

  @Get("dashboard")
  async getDashboardData(
    @Query("date") date: string, // "2026-03-27"
    @Query("shiftNumber") shiftNumber: string,
    @Query("nozzleNumber") nozzleNumber: string,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    return this.salesService.getDashboardData({
      adminId,
      date,
      shiftNumber: Number(shiftNumber),
      nozzleNumber: nozzleNumber ? Number(nozzleNumber) : undefined,
    });
  }
}
