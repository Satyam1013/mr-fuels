import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ShiftStatusEnum } from "../shift-status/shift-status.enum";

export class CreateStaffDto {
  @IsString()
  staffName!: string;

  @IsString()
  staffNumber!: string;

  @IsOptional()
  @IsString()
  staffAadhar?: string;

  @IsOptional()
  @IsString()
  staffPan?: string;

  @IsNumber()
  shift!: number;

  @IsString()
  salary!: string;
}
export class BulkCreateStaffDto {
  @IsNumber()
  numberOfStaff!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStaffDto)
  staff!: CreateStaffDto[];
}

class SalesAmountDto {
  @IsNumber() liters!: number;
  @IsNumber() amount!: number;
}

class TransactionsDto {
  @IsNumber() upi!: number;
  @IsNumber() pos!: number;
}

export class CreateSaleDto {
  @IsNumber()
  shiftNumber!: number;

  @IsString()
  date!: string; // "YYYY-MM-DD"

  @ValidateNested()
  @Type(() => SalesAmountDto)
  overallSales!: SalesAmountDto;

  @ValidateNested()
  @Type(() => SalesAmountDto)
  netSales!: SalesAmountDto;

  @ValidateNested()
  @Type(() => SalesAmountDto)
  testing!: SalesAmountDto;

  @IsNumber() overallCreditorsAmount!: number;
  @IsNumber() prepaid!: number;
  @IsNumber() pumpExpenses!: number;
  @IsNumber() personalExpenses!: number;
  @IsNumber() lubricantSales!: number;

  @ValidateNested()
  @Type(() => TransactionsDto)
  transactions!: TransactionsDto;

  @IsObject() machines!: object;

  @IsArray()
  @IsOptional()
  staff?: object[];

  @IsEnum(ShiftStatusEnum)
  @IsOptional()
  shiftStatus?: ShiftStatusEnum;
}
