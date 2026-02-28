import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { Admin, AdminSchema } from "../admin/admin.schema";
import { PumpStatus, PumpStatusSchema } from "./pump-status.schema";
import { PumpStatusController } from "./pump-status.controller";
import { PumpStatusService } from "./pump-status.service";
import { Staff, StaffSchema } from "../staff/staff.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PumpStatus.name, schema: PumpStatusSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Staff.name, schema: StaffSchema },
    ]),
  ],
  controllers: [PumpStatusController],
  providers: [PumpStatusService],
})
export class PumpStatusModule {}
