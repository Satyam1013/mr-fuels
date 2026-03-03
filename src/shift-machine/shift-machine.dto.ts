import { IsString, IsNumber, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class NozzleDto {
  @IsString()
  nozzleName!: string;

  @IsString()
  fuelType!: string;

  @IsNumber()
  lastReading!: number;

  @IsNumber()
  currentReading!: number;

  @IsNumber()
  pricePerLiter!: number;

  @IsNumber()
  testingLiters!: number;

  @IsNumber()
  faultTestingLiters!: number;

  @IsString()
  narration!: string;
}

export class CreateShiftMachineDto {
  @IsString()
  date!: string;

  @IsNumber()
  shiftId!: number;

  @IsNumber()
  shiftNumber!: number;

  @IsString()
  machineName!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NozzleDto)
  nozzles!: NozzleDto[];
}
