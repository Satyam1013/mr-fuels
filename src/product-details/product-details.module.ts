import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductDetailsController } from "./product-details.controller";
import { ProductDetailsService } from "./product-details.service";
import { ProductDetails, ProductDetailsSchema } from "./product-details.schema";
import { Admin, AdminSchema } from "../admin/admin.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductDetails.name,
        schema: ProductDetailsSchema,
      },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [ProductDetailsController],
  providers: [ProductDetailsService],
})
export class ProductDetailsModule {}
