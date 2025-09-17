import { IsDateString, IsEnum } from "class-validator";

export enum AttendanceStatus {
  PRESENT = "P",
  ABSENT = "A",
  HALF_DAY = "H",
  LEAVE = "L",
}

export class UpdateAttendanceDto {
  @IsDateString()
  date!: string; // YYYY-MM-DD

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;
}
