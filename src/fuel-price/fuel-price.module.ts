import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { FuelPriceService } from "./fuel-price.service";
import { FuelPriceController } from "./fuel-price.controller";
import { FuelPrice, FuelPriceSchema } from "./fuel-price.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FuelPrice.name, schema: FuelPriceSchema },
    ]),
  ],
  providers: [FuelPriceService],
  controllers: [FuelPriceController],
  exports: [MongooseModule, FuelPriceService],
})
export class FuelPriceModule {}
