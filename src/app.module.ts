import { Module } from "@nestjs/common";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MachineModule } from "./machine/machine.module";
import { FuelPriceModule } from "./fuel-price/fuel-price.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    AdminModule,
    AuthModule,
    MachineModule,
    FuelPriceModule,
  ],
})
export class AppModule {}
