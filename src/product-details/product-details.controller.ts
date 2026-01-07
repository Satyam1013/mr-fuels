import { Body, Controller, Post, Req } from "@nestjs/common";
import { ProductDetailsService } from "./product-details.service";
import { CreateProductDetailsDto } from "./product-details.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("product-details")
export class ProductDetailsController {
  constructor(private readonly productDetailsService: ProductDetailsService) {}

  @Post()
  async addProductDetails(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateProductDetailsDto,
  ) {
    return this.productDetailsService.addProductDetails(req.user.adminId, dto);
  }
}
