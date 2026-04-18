import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from "class-validator";
import { DepositByEnum } from "./bank-deposit.schema";
import { PartialType } from "@nestjs/mapped-types";

export class CreateBankDepositDto {
  @IsString()
  date!: string; // "YYYY-MM-DD"

  @IsNumber()
  shiftNumber!: number;

  @IsNumber()
  @Min(0)
  totalDepositAmount!: number;

  @IsNumber()
  @Min(0)
  remainingAmount!: number;

  @IsNumber()
  @Min(0)
  pumpCash!: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  additionalCash?: number;

  @IsEnum(DepositByEnum)
  depositBy!: DepositByEnum;

  @IsString()
  depositorName!: string;

  // Staff select kiya toh staffId required
  @ValidateIf((o: CreateBankDepositDto) => o.depositBy === DepositByEnum.STAFF)
  @IsString()
  staffId?: string;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class UpdateBankDepositDto extends PartialType(CreateBankDepositDto) {}
