import { Controller, Get, Query } from "@nestjs/common";
import { HomeService } from "./home.service";
import { FilterType } from "./home.dto";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getAll(
    @Query("filterType") filterType: FilterType,
    @Query("date") date: string,
  ) {
    return this.homeService.getAll(filterType, date);
  }
}
