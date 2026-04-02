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

  @Get("report")
  async getReport(
    @Query("date") date: string,
    @Query("shiftNumber") shiftNumber: string,
    @Query("filterType") filterType: FilterType,
    @Query("startDate") startDate: string,
    @Query("endDate") endDate: string,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    if (date && shiftNumber) {
      return this.salesService.getSalesReport({
        adminId,
        type: "single",
        date,
        shiftNumber: Number(shiftNumber),
      });
    }

    return this.salesService.getSalesReport({
      adminId,
      type: "range",
      filterType,
      startDate,
      endDate,
    });
  }
}
