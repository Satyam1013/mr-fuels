import { Module } from "@nestjs/common";
import { HomeService } from "./home.service";
import { HomeController } from "./home.controller";
import { PumpExpenseModule } from "../pump-expenses/pump-expenses.module";

@Module({
  imports: [PumpExpenseModule],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
