import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";

class PumpTimeDto {
  @IsString()
  start!: string;

  @IsString()
  end!: string;
}

export class CreatePumpDetailsDto {
  @IsString()
  fuelPartner!: string;

  @IsNumber()
  pumpHours!: number;

  @IsNumber()
  numberOfShifts!: number;

  @IsMongoId()
  tank!: string;

  @ValidateNested()
  @Type(() => PumpTimeDto)
  pumpTime!: PumpTimeDto;

  @IsString()
  dailyCloseReportTime!: string;

  @IsBoolean()
  @IsOptional()
  is24Hour?: boolean;
}

export class UpdatePumpDetailsDto extends PartialType(CreatePumpDetailsDto) {}
