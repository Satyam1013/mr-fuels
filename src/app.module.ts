import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";

import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { MachineModule } from "./machine/machine.module";
import { FuelPriceModule } from "./fuel-price/fuel-price.module";
import { PumpDataModule } from "./pump-data/pump-data.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    ScheduleModule.forRoot(),
    AdminModule,
    AuthModule,
    MachineModule,
    FuelPriceModule,
    PumpDataModule,
  ],
  providers: [],
})
export class AppModule {}
