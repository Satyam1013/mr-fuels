import { Controller, Post, Get, Body, Delete, Param } from "@nestjs/common";
import { CreateNonFuelSellProductDto } from "./non-fuel-product-sales.dto";
import { NonFuelProductSellService } from "./non-fuel-product-sales.service";
import { Types } from "mongoose";
import { GetUser } from "../auth/get-user.decoration";

@Controller("non-fuel-product-sales")
export class NonFuelProductSellController {
  constructor(private readonly nonFuelSellService: NonFuelProductSellService) {}

  @Post()
  addProducts(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dtos: CreateNonFuelSellProductDto[],
  ) {
    return this.nonFuelSellService.addProducts(adminId, dtos);
  }

  @Get()
  async getProducts(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.nonFuelSellService.getProducts(adminId);
  }

  @Delete(":id")
  async deleteProduct(@Param("id") id: string) {
    return this.nonFuelSellService.deleteProduct(id);
  }
}
