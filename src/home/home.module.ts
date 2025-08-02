import { Module } from "@nestjs/common";
import { HomeService } from "./home.service";
import { HomeController } from "./home.controller";
import { PumpExpenseModule } from "../pump-expenses/pump-expenses.module";
import { CreditorModule } from "../creditors/creditors.module";
import { AuthModule } from "../auth/auth.module";
import { PersonalExpenseModule } from "../personal-expenses/personal-expenses.module";

@Module({
  imports: [
    PumpExpenseModule,
    PersonalExpenseModule,
    CreditorModule,
    AuthModule,
  ],
  providers: [HomeService],
  controllers: [HomeController],
  exports: [AuthModule],
})
export class HomeModule {}
