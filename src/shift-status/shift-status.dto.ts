import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ClosedBy, PumpStatusEnum, ShiftStatusEnum } from "./shift-status.enum";

class ShiftDto {
  @IsNumber()
  shiftNumber!: number;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsEnum(ShiftStatusEnum)
  status!: ShiftStatusEnum;

  @IsOptional()
  @IsEnum(ClosedBy)
  closedBy?: ClosedBy;
}

export class CreateShiftStatusDto {
  @IsString()
  date!: string;

  @IsNumber()
  totalShifts!: number;

  @ValidateNested()
  @Type(() => ShiftDto)
  currentShift!: ShiftDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShiftDto)
  shifts!: ShiftDto[];

  @IsOptional()
  @IsBoolean()
  dailyClose?: boolean;

  @IsOptional()
  @IsEnum(PumpStatusEnum)
  pumpStatus?: PumpStatusEnum;
}
