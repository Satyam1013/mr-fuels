import { IsEnum, IsOptional, IsString } from "class-validator";

export enum TimeFilter {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
  ALL = "all",
}

export class TimeFilterQueryDto {
  @IsOptional()
  @IsEnum(TimeFilter)
  filter?: TimeFilter;

  // daily ke liye
  @IsOptional()
  @IsString()
  date?: string;

  // weekly custom range ke liye
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  // monthly ke liye
  @IsOptional()
  @IsString()
  month?: string;
}
