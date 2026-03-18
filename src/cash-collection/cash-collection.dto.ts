import {
  IsMongoId,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsArray,
} from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";

class DenominationDto {
  @IsNumber()
  denomination!: number;

  @IsNumber()
  count!: number;

  @IsNumber()
  amount!: number;
}

export class CreateCashCollectionDto {
  @IsMongoId()
  machineId!: string;

  @IsNumber()
  nozzleNumber!: number;

  @IsNumber()
  shiftNumber!: number;

  @IsDateString()
  date!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DenominationDto)
  denominations!: DenominationDto[];

  @IsNumber()
  totalAmount!: number;
}

export class UpdateCashCollectionDto extends PartialType(
  CreateCashCollectionDto,
) {}
