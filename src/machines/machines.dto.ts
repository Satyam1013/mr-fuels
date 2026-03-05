import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsBoolean,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

class NozzleDto {
  @IsNumber()
  @IsNotEmpty()
  nozzleNumber!: number;

  @IsString()
  @IsNotEmpty()
  fuelType!: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  machineNumber!: string;

  @IsString()
  @IsNotEmpty()
  machineName!: string;

  @IsNumber()
  nozzleCount!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NozzleDto)
  nozzle!: NozzleDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class BulkCreateMachineDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMachineDto)
  machines!: CreateMachineDto[];
}
