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
  @IsString()
  @IsNotEmpty()
  fuelType!: string;
}

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  machineNumber!: string;

  @IsString()
  @IsNotEmpty()
  machineKey!: string;

  @IsNumber()
  nozzleCount!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NozzleDto)
  nozzles!: NozzleDto[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
