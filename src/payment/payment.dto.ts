import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class UpiPaymentItemDto {
  @IsString()
  @IsNotEmpty()
  appName!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  attachmentName!: string;
}

export class SubmitUpiDto {
  @IsString()
  @IsNotEmpty()
  date!: string;

  @IsNumber()
  shiftId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpiPaymentItemDto)
  upiPayments!: UpiPaymentItemDto[];
}
