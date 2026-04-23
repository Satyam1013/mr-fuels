import {
  IsDateString,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

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

  @IsMongoId()
  creditBy!: string;

  @IsOptional()
  @IsString()
  narration?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
