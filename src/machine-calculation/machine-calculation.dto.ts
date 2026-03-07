import { IsArray, IsDateString, IsMongoId, IsNumber } from "class-validator";

export class NozzleCalculationDto {
  @IsNumber()
  nozzleNumber!: number;

  @IsMongoId()
  staffId!: string;

  @IsNumber()
  fuelSaleAmount!: number;

  @IsArray()
  creditIds!: string[];

  @IsArray()
  pumpExpenseIds!: string[];

  @IsArray()
  personalExpenseIds!: string[];

  @IsArray()
  prepaidIds!: string[];

  @IsArray()
  nonFuelProductIds!: string[];
}

export class CreateMachineCalculationDto {
  @IsMongoId()
  machineId!: string;

  @IsDateString()
  date!: string;

  @IsNumber()
  shiftNumber!: number;

  @IsArray()
  nozzles!: NozzleCalculationDto[];
}
