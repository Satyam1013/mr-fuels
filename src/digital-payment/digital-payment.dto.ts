import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class UpiPaymentDto {
  @IsString()
  appName!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  attachmentName?: string;

  @IsOptional()
  @IsString()
  attachmentUri?: string;
}

class PosPaymentDto {
  @IsString()
  machineName!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  attachmentName?: string;

  @IsOptional()
  @IsString()
  attachmentUri?: string;
}

export class CreateDigitalPaymentDto {
  @IsString()
  date!: string;

  @IsNumber()
  shiftId!: number;

  @IsString()
  shiftName!: string;

  @IsNumber()
  shiftNumber!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpiPaymentDto)
  upiPayments!: UpiPaymentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosPaymentDto)
  posPayments!: PosPaymentDto[];
}
