import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsMongoId,
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
  @IsMongoId()
  creditorContactId!: string;

  @IsArray()
  records!: CreditRecordDto[];
}

export class UpdateCreditorDto {
  @IsMongoId()
  creditorContactId!: string;

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
