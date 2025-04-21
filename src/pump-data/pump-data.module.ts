import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PumpDataService } from "./pump-data.service";
import { PumpDataController } from "./pump-data.controller";
import { Machine, MachineSchema } from "../machine/machine.schema";
import { FuelPrice, FuelPriceSchema } from "../fuel-price/fuel-price.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Machine.name, schema: MachineSchema },
      { name: FuelPrice.name, schema: FuelPriceSchema },
    ]),
  ],
  controllers: [PumpDataController],
  providers: [PumpDataService],
})
export class PumpDataModule {}
