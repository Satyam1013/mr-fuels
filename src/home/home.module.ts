import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Admin, AdminSchema } from "../admin/admin.schema";
import { HomeService } from "./home.service";
import { HomeController } from "./home.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  providers: [HomeService],
  controllers: [HomeController],
})
export class HomeModule {}
