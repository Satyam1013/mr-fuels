import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";

import { AuthModule } from "./auth/auth.module";
import { PumpDetailsModule } from "./pump-details/pump-details.module";
import { ManagerModule } from "./managers/managers.module";
import { StaffModule } from "./staff/staff.module";
import { TransactionDetailsModule } from "./transactions/transactions.module";
import { ProductDetailsModule } from "./product-details/product-details.module";
import { MachineModule } from "./machines/machines.module";
import { DsrDetailsModule } from "./dsr/dsr.module";
import { PlanModule } from "./plan-details/plan-details.module";
import { NonFuelProductModule } from "./non-fuel-product/non-fuel-product.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    ScheduleModule.forRoot(),
    AuthModule,
    PumpDetailsModule,
    ManagerModule,
    StaffModule,
    TransactionDetailsModule,
    ProductDetailsModule,
    MachineModule,
    DsrDetailsModule,
    PlanModule,
    NonFuelProductModule,
  ],
  providers: [],
})
export class AppModule {}
