import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { PlanModule } from "../plan/plan.module";
import { SuperAdmin, SuperAdminSchema } from "./super-admin.schema";
import { SuperAdminService } from "./super-admin.service";
import { SuperAdminController } from "./super-admin.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SuperAdmin.name, schema: SuperAdminSchema },
    ]),
    forwardRef(() => AuthModule),
    PlanModule,
  ],
  providers: [SuperAdminService],
  controllers: [SuperAdminController],
  exports: [SuperAdminService, MongooseModule],
})
export class SuperAdminModule {}
