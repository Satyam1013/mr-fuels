import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Machine, MachineSchema } from "./machines.schema";
import { MachineService } from "./machines.service";
import { MachineController } from "./machines.controller";
import {
  FuelProductDetails,
  FuelProductDetailsSchema,
} from "../fuel-product/fuel-product.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Machine.name, schema: MachineSchema },
      { name: FuelProductDetails.name, schema: FuelProductDetailsSchema },
    ]),
  ],
  providers: [MachineService],
  controllers: [MachineController],
})
export class MachineModule {}
