import { Controller, Get, Query, Req } from "@nestjs/common";
import { HomeService } from "./home.service";
import { HomeQueryDto } from "./home.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomeData(@Req() req: AuthenticatedRequest, @Query() query: HomeQueryDto) {
    return this.homeService.getHomeData(req.user.adminId, query.filter);
  }

  @Get("sales")
  getSales(@Req() req: AuthenticatedRequest) {
    return this.homeService.getSalesData(req.user.adminId);
  }
}
