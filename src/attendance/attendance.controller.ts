import { Body, Controller, Get, Param, Put, Query } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { GetUser } from "../auth/get-user.decoration";
import { UpdateAttendanceDto } from "./attendance.dto";

@Controller("attendance")
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get("emp-data")
  async getEmpAttendance(
    @GetUser("pumpId") pumpId: string,
    @GetUser("role") role: "admin" | "manager",
    @Query("date") date: string,
    @Query("mode") mode: "day" | "week" | "month" = "day",
  ) {
    return this.attendanceService.getEmpData(pumpId, role, date, mode);
  }

  @Put("emp/:empId/day/:day")
  async updateAttendance(
    @Param("empId") empId: string,
    @Param("day") day: string, // YYYY-MM-DD
    @Body() dto: UpdateAttendanceDto,
    @GetUser("pumpId") pumpId: string,
  ) {
    await this.attendanceService.updateAttendance(
      pumpId,
      empId,
      dto.role,
      day, // ✅ always take from param
      dto.status,
    );
    return { success: true };
  }
}
