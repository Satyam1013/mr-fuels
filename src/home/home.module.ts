import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Home, HomeSchema } from "./home.schema";
import { HomeService } from "./home.service";
import { HomeController } from "./home.controller";
import { PumpExpenseModule } from "../pump-expenses/pump-expenses.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Home.name, schema: HomeSchema }]),
    PumpExpenseModule,
  ],
  providers: [HomeService],
  controllers: [HomeController],
  exports: [MongooseModule],
})
export class HomeModule {}
