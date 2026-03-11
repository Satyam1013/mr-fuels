import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Delete,
  Param,
} from "@nestjs/common";
import { NonFuelProductSellService } from "./non-fuel-product-sell.service";
import { CreateNonFuelSellProductDto } from "./non-fuel-product-sell.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("non-fuel-product-sells")
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
