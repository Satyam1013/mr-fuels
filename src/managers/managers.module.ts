import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ManagerController } from "./managers.controller";
import { ManagerService } from "./managers.service";
import { Manager, ManagerSchema } from "./managers.schema";
import { Admin, AdminSchema } from "../admin/admin.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Manager.name, schema: ManagerSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
