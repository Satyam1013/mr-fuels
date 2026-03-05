import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsMongoId,
  IsDateString,
  IsNotEmpty,
} from "class-validator";
import { CreditBy } from "./creditors.enum";

export class CreateCreditorDto {
  @IsString()
  creditorName!: string;

  @IsDateString()
  date!: string;

  @IsNumber()
  shiftNumber!: number;

  @IsNumber()
  amount!: number;

  @IsEnum(CreditBy)
  creditBy!: CreditBy;

  @IsNotEmpty()
  @IsString()
  phoneNumber!: string;

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
}
