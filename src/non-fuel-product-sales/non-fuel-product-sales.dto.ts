import {
  IsString,
  IsNumber,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsDateString,
} from "class-validator";
import { CreditBy } from "../creditors/creditors.enum";

export class CreateNonFuelSellProductDto {
  @IsMongoId()
  machineId!: string;

  @IsMongoId()
  productId!: string;

  @IsNumber()
  nozzleNumber!: number;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  pricePerUnit!: number;

  @IsNumber()
  amount!: number;

  @IsEnum(CreditBy)
  creditBy!: CreditBy;

  @IsDateString()
  date!: string;

  @IsNumber()
  shiftNumber!: number;

  @IsOptional()
  @IsString()
  narration?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}
