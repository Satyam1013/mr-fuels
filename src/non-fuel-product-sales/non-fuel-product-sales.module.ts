import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NonFuelProductSaleController } from "./non-fuel-product-sales.controller";
import { NonFuelProductSaleService } from "./non-fuel-product-sales.service";
import {
  NonFuelSaleProduct,
  NonFuelSaleProductSchema,
} from "./non-fuel-product-sales.schema";
import { Machine, MachineSchema } from "../machines/machines.schema";
import {
  NonFuelProducts,
  NonFuelProductsSchema,
} from "../non-fuel-product/non-fuel-product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NonFuelSaleProduct.name, schema: NonFuelSaleProductSchema },
      { name: Machine.name, schema: MachineSchema },
      { name: NonFuelProducts.name, schema: NonFuelProductsSchema },
    ]),
  ],
  controllers: [NonFuelProductSaleController],
  providers: [NonFuelProductSaleService],
})
export class NonFuelProductSaleModule {}
