import { PartialType } from "@nestjs/mapped-types";
import { FuelType } from "./machine.schema";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from "class-validator";

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  machineNo: string;

  @IsString()
  @IsNotEmpty()
  nozzleNo: string;

  @IsEnum(FuelType)
  fuelType: FuelType;

  @IsBoolean()
  isActive?: boolean;
}

export class UpdateMachineDto extends PartialType(CreateMachineDto) {}

export class UpdateReadingDto {
  @IsNumber()
  startDayReading: number;
}
