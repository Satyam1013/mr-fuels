import { Controller, Get, Query } from "@nestjs/common";
import { SalesService } from "./sales.service";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";
import { FilterType } from "./sales.enum";

@Controller("sales")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get("dashboard-setup")
  async getDashboardSetup(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.salesService.getDashboardSetup(adminId);
  }

  @Get("dashboard")
  async getDashboardData(
    @Query("date") date: string,
    @Query("shiftNumber") shiftNumber: string,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    return this.salesService.getDashboardData({
      adminId,
      date,
      shiftNumber: Number(shiftNumber),
    });
  }

  @Get("sales-report")
  async getSalesReport(
    @Query("filterType") filterType: FilterType,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    return this.salesService.getSalesReport({
      adminId,
      filterType,
      startDate,
      endDate,
    });
  }
}
