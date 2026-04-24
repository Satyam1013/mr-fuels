import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { ShiftStatusEnum } from "../shift-status/shift-status.enum";

class NozzleSaleDto {
  @IsNumber() liters!: number;
  @IsNumber() amount!: number;
}

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

class SalesNozzleDto {
  @IsNumber() nozzleNumber!: number;
  @IsString() fuelType!: string;
  @IsMongoId() @IsOptional() staffId?: string;
  @IsNumber() lastReading!: number;
  @IsNumber() currentReading!: number;
  @ValidateNested() @Type(() => NozzleSaleDto) sales!: NozzleSaleDto;
  @ValidateNested() @Type(() => NozzleSaleDto) netSales!: NozzleSaleDto;
  @ValidateNested() @Type(() => NozzleSaleDto) testing!: NozzleSaleDto;
  @IsBoolean() @IsOptional() faultTesting?: boolean;
  @IsString() @IsOptional() faultDesc?: string | null;
  @IsString() @IsOptional() faultImg?: string | null;
}

class MachineSpecificDto {
  @IsMongoId() machineId!: string;
  @IsString() machineName!: string;
  @IsNumber() cashCollected!: number;
}

class MachinesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalesNozzleDto)
  nozzles!: SalesNozzleDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MachineSpecificDto)
  @IsOptional()
  machineSpecific?: MachineSpecificDto[];
}

class StaffSaleDto {
  @IsMongoId() staffId!: string;
  @IsString() staffName!: string;
  @IsMongoId() machineId!: string;

  @IsArray()
  @IsNumber({}, { each: true })
  assignedNozzleNumbers!: number[];

  @IsOptional() @IsString() fuelType?: string;

  @ValidateNested() @Type(() => SalesAmountDto) sales!: SalesAmountDto;
  @ValidateNested() @Type(() => SalesAmountDto) netSales!: SalesAmountDto;
  @ValidateNested() @Type(() => SalesAmountDto) testing!: SalesAmountDto;

  @IsNumber() creditors!: number;
  @IsNumber() prepaid!: number;
  @IsNumber() lubricantSales!: number;

  @ValidateNested() @Type(() => TransactionsDto) transactions!: TransactionsDto;

  @IsNumber() pumpExpenses!: number;
  @IsNumber() personalExpenses!: number;

  @IsNumber() @IsOptional() cashCollected?: number;
}

export class CreateSaleDto {
  @IsNumber() shiftNumber!: number;
  @IsString() date!: string;

  @ValidateNested() @Type(() => SalesAmountDto) overallSales!: SalesAmountDto;
  @ValidateNested() @Type(() => SalesAmountDto) netSales!: SalesAmountDto;
  @ValidateNested() @Type(() => SalesAmountDto) testing!: SalesAmountDto;

  @IsNumber() overallCreditorsAmount!: number;
  @IsNumber() prepaid!: number;
  @IsNumber() pumpExpenses!: number;
  @IsNumber() personalExpenses!: number;
  @IsNumber() lubricantSales!: number;

  @ValidateNested() @Type(() => TransactionsDto) transactions!: TransactionsDto;

  @ValidateNested()
  @Type(() => MachinesDto)
  machines!: MachinesDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StaffSaleDto)
  @IsOptional()
  staff?: StaffSaleDto[];

  @IsEnum(ShiftStatusEnum) @IsOptional() shiftStatus?: ShiftStatusEnum;

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
