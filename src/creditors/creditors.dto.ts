import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { FilterType } from "../home/home.dto";

export class CreditRecordDto {
  @IsNumber()
  amount!: number;

  @IsDateString()
  time!: string;

  @IsEnum(["credit", "return"])
  type!: "credit" | "return";

  @IsString()
  imgUrl!: string;

  @IsString()
  details!: string;

  @IsEnum(["cash", "account"])
  paidType!: "cash" | "account";
}

export class CreateCreditorDto {
  @IsDateString() date!: string;

  @IsNumber()
  totalCreditGiven!: number;

  @IsNumber()
  totalCreditLeft!: number;

  @IsArray()
  records!: CreditRecordDto[];
}

export class GetCreditorsQueryDto {
  @IsOptional()
  @IsEnum(FilterType)
  filterType?: FilterType;

  @IsOptional()
  @IsString()
  date?: string;
}

export class UpdateCreditorDto extends CreateCreditorDto {}
