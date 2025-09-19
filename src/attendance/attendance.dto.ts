import { IsEnum, IsNotEmpty } from "class-validator";

export enum AttendanceStatus {
  PRESENT = "P",
  ABSENT = "A",
  HOLIDAY = "H",
  LEAVE = "L",
}

export class UpdateAttendanceDto {
  date!: string; // YYYY-MM-DD

  @IsEnum(AttendanceStatus)
  status!: AttendanceStatus;

  @IsNotEmpty()
  role!: "manager" | "staff";
}
