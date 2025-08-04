import { Controller, Get, Query } from "@nestjs/common";
import { HomeService } from "./home.service";
import { FilterType } from "./home.dto";
import { GetUser } from "../auth/get-user.decoration";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getAll(
    @GetUser("pumpId") pumpId: string,
    @Query("filterType") filterType: FilterType,
    @Query("date") date: string,
  ) {
    return this.homeService.getAll(pumpId, filterType, date);
  }
}
