import { Controller, Get, Query } from "@nestjs/common";
import { HomeService } from "./home.service";
import { FilterType } from "./home.dto";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get("pump-expense-summary")
  getExpenseSummary(
    @Query("filterType") filterType: FilterType,
    @Query("date") date: string,
  ) {
    return this.homeService.getPumpExpenseByFilter(filterType, date);
  }
}
