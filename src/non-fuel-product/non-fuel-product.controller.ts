import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { NonFuelProductsService } from "./non-fuel-product.service";
import { CreateNonFuelProductsDto } from "./non-fuel-product.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("non-fuel-products")
export class NonFuelProductsController {
  constructor(private readonly nonFuelService: NonFuelProductsService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateNonFuelProductsDto,
  ) {
    return this.nonFuelService.create(req.user.adminId, dto);
  }

  @Get()
  getAll(@Req() req: AuthenticatedRequest) {
    return this.nonFuelService.getAll(req.user.adminId);
  }
}
