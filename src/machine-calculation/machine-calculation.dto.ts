import {
  IsArray,
  IsDateString,
  IsMongoId,
  IsNumber,
  IsString,
} from "class-validator";

export class NozzleDto {
  @IsString()
  nozzleName!: string;

  @IsString()
  fuelType!: string;

  @IsNumber()
  lastReading!: number;

  @IsNumber()
  currentReading!: number;

  @IsNumber()
  testingLiters!: number;

  @IsNumber()
  faultTestingLiters!: number;

  @IsNumber()
  pricePerLiter!: number;

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
  nozzles!: NozzleDto[];
}
