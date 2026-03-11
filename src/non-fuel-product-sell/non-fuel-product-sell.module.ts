import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NonFuelProductSellController } from "./non-fuel-product-sell.controller";
import { NonFuelProductSellService } from "./non-fuel-product-sell.service";
import {
  NonFuelSellProduct,
  NonFuelSellProductSchema,
} from "./non-fuel-product-sell.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NonFuelSellProduct.name, schema: NonFuelSellProductSchema },
    ]),
  ],
  controllers: [NonFuelProductSellController],
  providers: [NonFuelProductSellService],
})
export class NonFuelProductSellModule {}
