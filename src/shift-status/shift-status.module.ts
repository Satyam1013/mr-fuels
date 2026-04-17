import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ShiftStatus, ShiftStatusSchema } from "./shift-status.schema";
import { ShiftStatusService } from "./shift-status.service";
import { ShiftStatusController } from "./shift-status.controller";
import {
  PumpDetails,
  PumpDetailsSchema,
} from "../pump-details/pump-details.schema";
import { Admin, AdminSchema } from "../admin/admin.schema";
import { Manager, ManagerSchema } from "../managers/managers.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShiftStatus.name, schema: ShiftStatusSchema },
      { name: PumpDetails.name, schema: PumpDetailsSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Manager.name, schema: ManagerSchema },
    ]),
  ],
  controllers: [ShiftStatusController],
  providers: [ShiftStatusService],
})
export class ShiftStatusModule {}
