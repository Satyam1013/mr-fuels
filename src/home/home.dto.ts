import { IsEnum, IsOptional, IsString } from "class-validator";
import { TimeFilter } from "./time.enum";

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
