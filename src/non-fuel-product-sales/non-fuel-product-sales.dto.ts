import {
  IsString,
  IsNumber,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
} from "class-validator";
import { CreditBy } from "../creditors/creditors.enum";
import { Type } from "class-transformer";

export class CreateNonFuelSaleProductDto {
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

export class CreateNonFuelSaleProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateNonFuelSaleProductDto)
  products!: CreateNonFuelSaleProductDto[];
}
