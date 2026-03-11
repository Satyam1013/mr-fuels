import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { NonFuelProductsService } from "./non-fuel-product.service";
import {
  CreateNonFuelProductsDto,
  NonFuelProductDto,
} from "./non-fuel-product.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("non-fuel-products")
export class NonFuelProductsController {
  constructor(private readonly nonFuelService: NonFuelProductsService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateNonFuelProductsDto,
  ) {
    return this.nonFuelService.create(req.user.adminId, dto.products);
  }

  @Get()
  getAll(@Req() req: AuthenticatedRequest) {
    return this.nonFuelService.getAll(req.user.adminId);
  }

  @Patch(":id")
  update(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: NonFuelProductDto,
  ) {
    return this.nonFuelService.update(req.user.adminId, id, dto);
  }

  @Delete(":id")
  delete(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.nonFuelService.delete(req.user.adminId, id);
  }
}
