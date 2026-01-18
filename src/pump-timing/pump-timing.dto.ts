import {
  IsString,
  IsBoolean,
  IsNumber,
  ValidateNested,
  IsNotEmpty,
} from "class-validator";
import { Type } from "class-transformer";

class TimeRangeDto {
  @IsString()
  @IsNotEmpty()
  start!: string;

  @IsString()
  @IsNotEmpty()
  end!: string;
}

export class UpdatePumpTimingDto {
  @IsString()
  @IsNotEmpty()
  dailyCloseReportTime!: string;

  @IsBoolean()
  is24Hour!: boolean;

  @IsNumber()
  pumpHours!: number;

  @ValidateNested()
  @Type(() => TimeRangeDto)
  pumpTime!: TimeRangeDto;
}
