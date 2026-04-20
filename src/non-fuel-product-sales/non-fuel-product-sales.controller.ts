import { Controller, Post, Get, Body, Delete, Param } from "@nestjs/common";
import { CreateNonFuelSaleProductsDto } from "./non-fuel-product-sales.dto";
import { NonFuelProductSaleService } from "./non-fuel-product-sales.service";
import { Types } from "mongoose";
import { GetUser } from "../auth/get-user.decoration";

@Controller("non-fuel-product-sales")
export class NonFuelProductSaleController {
  constructor(private readonly nonFuelSaleService: NonFuelProductSaleService) {}

  @Post()
  addProducts(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dtos: CreateNonFuelSaleProductsDto,
  ) {
    return this.nonFuelSaleService.addProducts(adminId, dtos.products);
  }

  @Get()
  async getProducts(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.nonFuelSaleService.getProducts(adminId);
  }

  @Delete(":id")
  async deleteProduct(@Param("id") id: string) {
    return this.nonFuelSaleService.deleteProduct(id);
  }
}
