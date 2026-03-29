import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FuelProductService } from "./fuel-product.service";
import { FuelProductController } from "./fuel-product.controller";
import {
  FuelProductDetails,
  FuelProductDetailsSchema,
} from "./fuel-product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FuelProductDetails.name, schema: FuelProductDetailsSchema },
    ]),
  ],
  controllers: [FuelProductController],
  providers: [FuelProductService],
  exports: [FuelProductService],
})
export class FuelProductModule {}
