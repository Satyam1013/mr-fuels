import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { SalesService } from "./sales.service";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";
import { FilterType } from "./sales.enum";
import { CreateSaleDto, UpdateSaleDto } from "./sales.dto";

@Controller("sales")
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async createSale(
    @Body() dto: CreateSaleDto,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    return this.salesService.createSale(adminId, dto);
  }

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
    @Query("calculationMode") calculationMode: "shiftwise" | "dailyCalculation",
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    // Single shift
    if (date && shiftNumber) {
      return this.salesService.getSalesReport({
        adminId,
        type: "single",
        date,
        shiftNumber: Number(shiftNumber),
      });
    }

    if (filterType === "daily") {
      return this.salesService.getSalesReport({
        adminId,
        type: "range",
        filterType,
        startDate: date,
        endDate: date,
        calculationMode: "dailyCalculation",
      });
    }

    // Weekly / Monthly / Custom — as is
    return this.salesService.getSalesReport({
      adminId,
      type: "range",
      filterType,
      startDate,
      endDate,
      calculationMode,
    });
  }

  @Patch(":id")
  async updateSale(
    @Param("id") id: string,
    @Body() dto: UpdateSaleDto,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    return this.salesService.updateSale(adminId, id, dto);
  }

  @Delete(":id")
  async deleteSale(
    @Param("id") id: string,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    return this.salesService.deleteSale(adminId, id);
  }
}
