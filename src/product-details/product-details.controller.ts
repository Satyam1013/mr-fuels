import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ProductDetailsService } from "./product-details.service";
import { CreateProductDetailsDto } from "./product-details.dto";
import { AuthGuard } from "@nestjs/passport";

interface AuthenticatedRequest extends Request {
  user: {
    adminId: string;
  };
}

@Controller("product-details")
@UseGuards(AuthGuard("jwt"))
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
