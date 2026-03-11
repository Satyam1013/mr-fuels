import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  NonFuelProducts,
  NonFuelProductsSchema,
} from "./non-fuel-product.schema";
import { NonFuelProductsService } from "./non-fuel-product.service";
import { NonFuelProductsController } from "./non-fuel-product.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NonFuelProducts.name, schema: NonFuelProductsSchema },
    ]),
  ],
  controllers: [NonFuelProductsController],
  providers: [NonFuelProductsService],
})
export class NonFuelProductsModule {}
