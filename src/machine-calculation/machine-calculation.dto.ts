import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class StaffAssignmentDto {
  @IsMongoId()
  staffId!: string;

  @IsArray()
  @IsNumber({}, { each: true })
  assignedNozzleNumbers!: number[];

  @IsNumber()
  upiAmount!: number;

  @IsNumber()
  posAmount!: number;
}

export class NozzleDto {
  @IsString()
  nozzleName!: string;

  @IsNumber()
  nozzleNumber!: number;

  @IsMongoId()
  fuelProductId!: string;

  @IsNumber()
  lastReading!: number;

  @IsNumber()
  currentReading!: number;

  @IsNumber()
  testingLiters!: number;

  @IsNumber()
  faultTestingLiters!: number;

  @IsNumber()
  @IsOptional()
  changeReading?: number;

  @IsBoolean()
  @IsOptional()
  isPriceChanged?: boolean;
}

export class CreateMachineCalculationDto {
  @IsMongoId()
  machineId!: string;

  @IsDateString()
  date!: string;

  @IsNumber()
  shiftNumber!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NozzleDto)
  nozzles!: NozzleDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StaffAssignmentDto)
  staff!: StaffAssignmentDto[];
}

export class GetNozzleDetailsDto {
  @IsMongoId()
  machineId!: string;
}

export class UpdateMachineCalculationDto extends PartialType(
  CreateMachineCalculationDto,
) {}
