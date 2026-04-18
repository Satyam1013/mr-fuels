import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsDateString,
} from "class-validator";
import { CreditBy, CreditStatusEnum } from "./creditors.enum";

export class CreateCreditorDto {
  @IsMongoId()
  customerId!: string;

  @IsOptional()
  @IsDateString()
  creditDate?: string;

  @IsOptional()
  @IsDateString()
  returnDate?: string;

  @IsNumber()
  shiftNumber!: number;

  @IsNumber()
  amount!: number;

  @IsEnum(CreditBy)
  creditBy!: CreditBy;

  @IsOptional()
  @IsString()
  narration?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsMongoId()
  machineId!: string;

  @IsNumber()
  nozzleNumber!: number;

  @IsOptional()
  @IsEnum(CreditStatusEnum)
  creditStatus?: CreditStatusEnum;
}
