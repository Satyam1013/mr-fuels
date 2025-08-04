import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PlanModule } from "../plan/plan.module";
import { SuperAdmin, SuperAdminSchema } from "./super-admin.schema";
import { SuperAdminService } from "./super-admin.service";
import { SuperAdminController } from "./super-admin.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SuperAdmin.name, schema: SuperAdminSchema },
    ]),
    PlanModule,
  ],
  providers: [SuperAdminService],
  controllers: [SuperAdminController],
  exports: [SuperAdminService, MongooseModule],
})
export class SuperAdminModule {}
