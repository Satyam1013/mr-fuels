import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class NonFuelProductDto {
  @IsString()
  productName!: string;

  @IsNumber()
  price!: number;

  @IsNumber()
  totalStock!: number;

  @IsString()
  unitType!: string;

  @IsOptional()
  @IsNumber()
  amountCollected?: number;
}

export class CreateNonFuelProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NonFuelProductDto)
  products!: NonFuelProductDto[];
}
