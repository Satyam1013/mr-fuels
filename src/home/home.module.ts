import { Module } from "@nestjs/common";
import { HomeService } from "./home.service";
import { HomeController } from "./home.controller";
import { PumpExpenseModule } from "../pump-expenses/pump-expenses.module";
import { CreditorModule } from "../creditors/creditors.module";
import { PersonalExpenseModule } from "../personal-expenses/personal-expenses.module";

@Module({
  imports: [PumpExpenseModule, PersonalExpenseModule, CreditorModule],
  providers: [HomeService],
  controllers: [HomeController],
  exports: [],
})
export class HomeModule {}
