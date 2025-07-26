import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";

import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { PlanModule } from "./plan/plan.module";
import { SuperAdminModule } from "./super-admin/super-admin.module";
import { HomeModule } from "./home/home.module";
import { PumpExpenseModule } from "./pump-expenses/pump-expenses.module";
import { PersonalExpenseModule } from "./personal-expenses/personal-expenses.module";
import { CreditorModule } from "./creditors/creditors.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    ScheduleModule.forRoot(),
    SuperAdminModule,
    PumpExpenseModule,
    PersonalExpenseModule,
    AdminModule,
    AuthModule,
    PlanModule,
    HomeModule,
    CreditorModule,
  ],
  providers: [],
})
export class AppModule {}
