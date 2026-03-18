import { Body, Controller, Post } from "@nestjs/common";
import { ProductDetailsService } from "./product-details.service";
import { CreateProductDetailsDto } from "./product-details.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("product-details")
export class ProductDetailsController {
  constructor(private readonly productDetailsService: ProductDetailsService) {}

  @Post()
  async addProductDetails(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateProductDetailsDto,
  ) {
    return this.productDetailsService.addProductDetails(adminId, dto);
  }
}
