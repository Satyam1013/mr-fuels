import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { CreditBy } from "../creditors/creditors.enum";

export class CreatePumpExpenseDto {
  @IsString()
  name!: string;

  @IsDateString()
  date!: string;

  @IsNumber()
  shiftNumber!: number;

  @IsNumber()
  amount!: number;

  @IsString()
  category!: string;

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
}
