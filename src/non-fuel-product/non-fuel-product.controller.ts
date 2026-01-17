import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Delete,
  Param,
} from "@nestjs/common";
import { NonFuelProductService } from "./non-fuel-product.service";
import { CreateNonFuelProductDto } from "./non-fuel-product.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("non-fuel-products")
export class NonFuelProductController {
  constructor(private readonly nonFuelService: NonFuelProductService) {}

  @Post()
  async addProducts(
    @Req() req: AuthenticatedRequest,
    @Body() dtos: CreateNonFuelProductDto[],
  ) {
    return this.nonFuelService.addProducts(req.user.adminId, dtos);
  }

  @Get()
  async getProducts(@Req() req: AuthenticatedRequest) {
    return this.nonFuelService.getProducts(req.user.adminId);
  }

  @Delete(":id")
  async deleteProduct(@Param("id") id: string) {
    return this.nonFuelService.deleteProduct(id);
  }
}
