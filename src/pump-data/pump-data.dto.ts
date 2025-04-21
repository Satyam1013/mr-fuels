import { IsEnum, IsString } from "class-validator";

export enum PumpDataType {
  DAILY = "daily",
  MONTHLY = "monthly",
}

export class GetPumpDataDto {
  @IsString()
  date: string; // Format: YYYY-MM-DD

  @IsEnum(PumpDataType)
  type: PumpDataType;
}
