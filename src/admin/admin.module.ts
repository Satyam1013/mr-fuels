import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { Admin, AdminSchema } from "./admin.schema";
import { PlanModule } from "../plan/plan.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    PlanModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [MongooseModule],
})
export class AdminModule {}
