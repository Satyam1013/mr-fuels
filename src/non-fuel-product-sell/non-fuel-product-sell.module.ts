import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NonFuelProductSellController } from "./non-fuel-product-sell.controller";
import { NonFuelProductSellService } from "./non-fuel-product-sell.service";
import {
  NonFuelSellProduct,
  NonFuelSellProductSchema,
} from "./non-fuel-product-sell.schema";
import { Machine, MachineSchema } from "../machines/machines.schema";
import {
  NonFuelProducts,
  NonFuelProductsSchema,
} from "../non-fuel-product/non-fuel-product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NonFuelSellProduct.name, schema: NonFuelSellProductSchema },
      { name: Machine.name, schema: MachineSchema },
      { name: NonFuelProducts.name, schema: NonFuelProductsSchema },
    ]),
  ],
  controllers: [NonFuelProductSellController],
  providers: [NonFuelProductSellService],
})
export class NonFuelProductSellModule {}
