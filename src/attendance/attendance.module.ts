import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Attendance, AttendanceSchema } from "./attendance.schema";
import { AttendanceService } from "./attendance.service";
import { AttendanceController } from "./attendance.controller";
import { Admin, AdminSchema } from "../admin/admin.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
