import { PartialType } from "@nestjs/mapped-types";
import {
  IsNumber,
  IsString,
  IsEnum,
  IsMongoId,
  IsOptional,
} from "class-validator";

export class CreatePumpStatusDto {
  @IsNumber()
  machineNo!: number;

  @IsString()
  nozzleNumber!: string;

  @IsString()
  fuelType!: string;

  @IsEnum(["active", "inactive", "maintenance"])
  status!: string;

  @IsMongoId()
  handledBy!: string;

  @IsEnum(["Admin", "Manager", "Staff"])
  handledByModel!: string;

  @IsOptional()
  @IsString()
  lastUpdatedAt?: string;
}

export class UpdatePumpStatusDto extends PartialType(CreatePumpStatusDto) {}
