import { Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";

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
  upiAmount!: number;

  @IsNumber()
  posAmount!: number;

  @IsMongoId()
  staffId!: string;
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
}

export class GetNozzleDetailsDto {
  @IsMongoId()
  machineId!: string;
}
