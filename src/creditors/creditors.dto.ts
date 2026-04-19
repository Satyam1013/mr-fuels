import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsDateString,
} from "class-validator";
import { CreditStatusEnum } from "./creditors.enum";

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

  @IsMongoId()
  creditBy!: string;

  @IsOptional()
  @IsString()
  narration?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsEnum(CreditStatusEnum)
  creditStatus?: CreditStatusEnum;
}
