import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { Admin, AdminSchema } from "./admin.schema";
import { AuthModule } from "../auth/auth.module";
import { PlanModule } from "../plan/plan.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() => AuthModule),
    PlanModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService, MongooseModule],
})
export class AdminModule {}
