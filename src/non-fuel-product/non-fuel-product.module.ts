import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NonFuelProductController } from "./non-fuel-product.controller";
import { NonFuelProductService } from "./non-fuel-product.service";
import {
  NonFuelProduct,
  NonFuelProductSchema,
} from "./non-fuel-product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NonFuelProduct.name, schema: NonFuelProductSchema },
    ]),
  ],
  controllers: [NonFuelProductController],
  providers: [NonFuelProductService],
})
export class NonFuelProductModule {}
