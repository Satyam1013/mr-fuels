import {
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
  IsMongoId,
} from "class-validator";
import { CreditBy } from "../creditors/creditors.enum";

export class CreatePersonalExpenseDto {
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
