import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Delete,
  Param,
} from "@nestjs/common";
import { CreateNonFuelSellProductDto } from "./non-fuel-product-sales.dto";
import { AuthenticatedRequest } from "../auth/auth.request";
import { NonFuelProductSellService } from "./non-fuel-product-sales.service";

@Controller("non-fuel-product-sales")
export class NonFuelProductSellController {
  constructor(private readonly nonFuelSellService: NonFuelProductSellService) {}

  @Post()
  addProducts(
    @Req() req: AuthenticatedRequest,
    @Body() dtos: CreateNonFuelSellProductDto[],
  ) {
    return this.nonFuelSellService.addProducts(req.user.adminId, dtos);
  }

  @Get()
  async getProducts(@Req() req: AuthenticatedRequest) {
    return this.nonFuelSellService.getProducts(req.user.adminId);
  }

  @Delete(":id")
  async deleteProduct(@Param("id") id: string) {
    return this.nonFuelSellService.deleteProduct(id);
  }
}
