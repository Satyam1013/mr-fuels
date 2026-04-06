import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  ValidateNested,
} from "class-validator";
import { FuelType } from "../common/enums/fuel-type.enum";
import { Type } from "class-transformer";

export class CreateFuelProductDto {
  @IsEnum(FuelType)
  fuelType!: FuelType;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsOptional()
  @Min(0)
  oldPrice?: number;

  @IsNumber()
  @Min(0)
  purchasingPrice!: number;

  @IsOptional()
  @IsNumber()
  shiftNumber?: number | null;
}

export class CreateFuelProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFuelProductDto)
  products!: CreateFuelProductDto[];
}

export class UpdateFuelProductDto {
  @IsEnum(FuelType)
  fuelType!: FuelType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  purchasingPrice?: number;

  @IsOptional()
  @IsNumber()
  shiftNumber?: number | null;
}

export class UpdateFuelProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateFuelProductDto)
  products!: UpdateFuelProductDto[];
}
