import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsMongoId,
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

class ReturnCreditTotalsDto {
  @IsNumber() upi!: number;
  @IsNumber() cash!: number;
  @IsNumber() accountPay!: number;
}

class DifferenceSummaryDto {
  @IsNumber() mainDifference!: number;
  @IsNumber() overallShortage!: number;
  @IsNumber() overallPumpSalesShortage!: number;
  @IsNumber() overallShortageMoneyReceived!: number;
  @IsNumber() inHandCash!: number;
  @IsNumber() moneyDeposited!: number;
}

class SalesAmountDto {
  @IsNumber() liters!: number;
  @IsNumber() amount!: number;
}

class TransactionsDto {
  @IsNumber() upi!: number;
  @IsNumber() pos!: number;
}

class StaffSaleDto {
  @IsMongoId() staffId!: string;
  @IsString() staffName!: string;
  @IsMongoId() machineId!: string;

  @IsArray()
  @IsNumber({}, { each: true })
  assignedNozzleNumbers!: number[];

  @IsOptional() @IsString() fuelType?: string;

  @ValidateNested()
  @Type(() => SalesAmountDto)
  sales!: SalesAmountDto;

  @ValidateNested()
  @Type(() => SalesAmountDto)
  netSales!: SalesAmountDto;

  @ValidateNested()
  @Type(() => SalesAmountDto)
  testing!: SalesAmountDto;

  @IsNumber() creditors!: number;
  @IsNumber() prepaid!: number;
  @IsNumber() lubricantSales!: number;

  @ValidateNested()
  @Type(() => TransactionsDto)
  transactions!: TransactionsDto;

  @IsNumber() pumpExpenses!: number;
  @IsNumber() personalExpenses!: number;
}

export class CreateSaleDto {
  @IsNumber()
  shiftNumber!: number;

  @IsString()
  date!: string;

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

  @IsObject()
  machines!: object;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StaffSaleDto)
  @IsOptional()
  staff?: StaffSaleDto[];

  @IsEnum(ShiftStatusEnum)
  @IsOptional()
  shiftStatus?: ShiftStatusEnum;

  // ── Return Credit ──
  @ValidateNested()
  @Type(() => ReturnCreditTotalsDto)
  @IsOptional()
  returnCreditTotals?: ReturnCreditTotalsDto;

  @IsNumber() @IsOptional() returnCreditUpi?: number;
  @IsNumber() @IsOptional() returnCreditCash?: number;
  @IsNumber() @IsOptional() returnCreditAccountPay?: number;

  // ── Deposit ──
  @IsNumber() @IsOptional() remainingDepositedAmount?: number;
  @IsNumber() @IsOptional() depositAmount?: number;
  @IsNumber() @IsOptional() additionalDepositAmount?: number;
  @IsNumber() @IsOptional() moneyDeposited?: number;

  // ── Cash Summary ──
  @IsNumber() @IsOptional() inHandCash?: number;
  @IsNumber() @IsOptional() overallAmountGeneratedByPump?: number;
  @IsNumber() @IsOptional() amountReceivedToPump?: number;

  // ── Difference Summary ──
  @ValidateNested()
  @Type(() => DifferenceSummaryDto)
  @IsOptional()
  differenceSummary?: DifferenceSummaryDto;
}
