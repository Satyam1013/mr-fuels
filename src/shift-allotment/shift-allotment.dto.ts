import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class NozzleAllotmentDto {
  @IsString()
  nozzleId!: string;

  @IsMongoId()
  staffId!: string;

  @IsEnum(["Active", "Inactive"])
  nozzleStatus!: string;

  @IsOptional()
  @IsString()
  inactiveStatus?: string;
}

export class MachineAllotmentDto {
  @IsString()
  machineId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NozzleAllotmentDto)
  nozzles!: NozzleAllotmentDto[];
}

export class CreateShiftAllotmentDto {
  @IsString()
  shiftId!: string;

  @IsArray()
  @IsMongoId({ each: true })
  managers!: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MachineAllotmentDto)
  machines!: MachineAllotmentDto[];
}

export class UpdateShiftAllotmentDto extends PartialType(
  CreateShiftAllotmentDto,
) {}
