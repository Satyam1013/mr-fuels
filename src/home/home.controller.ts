import { Controller, Get, Query } from "@nestjs/common";
import { HomeService } from "./home.service";
import { TimeFilterQueryDto } from "./home.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomeData(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Query() query: TimeFilterQueryDto,
  ) {
    return this.homeService.getHomeData(adminId, query);
  }

  @Get("sales")
  getSales(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Query() query: TimeFilterQueryDto,
  ) {
    return this.homeService.getSalesData(adminId, query);
  }
}
