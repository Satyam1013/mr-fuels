import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { PumpStatusEnum, ShiftStatusEnum } from "./shift-status.enum";
import { Role } from "../admin/admin.enum";

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
  @IsMongoId()
  closedBy?: string;

  @IsOptional()
  @IsEnum(Role)
  closedByModel?: Role;
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
