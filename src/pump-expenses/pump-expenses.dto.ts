import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

class EntryDto {
  @IsString() title!: string;
  @IsNumber() amount!: number;
  @IsDateString() time!: string;
  @IsString() category!: string;
  @IsString() paymentMode!: string;
  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CreatePumpExpenseDto {
  @IsDateString() date!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entries!: EntryDto[];
}

export class UpdatePumpExpenseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntryDto)
  entries!: EntryDto[];
}
