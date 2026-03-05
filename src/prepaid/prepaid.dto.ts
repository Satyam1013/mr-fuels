import {
  IsString,
  IsNumber,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
} from "class-validator";
import { CreditBy } from "../creditors/creditors.enum";

export class CreatePrepaidDto {
  @IsString()
  partyName!: string;

  @IsString()
  phoneNumber!: string;

  @IsNumber()
  amount!: number;

  @IsDateString()
  date!: string;

  @IsNumber()
  shiftNumber!: number;

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
