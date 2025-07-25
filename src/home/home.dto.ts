import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export enum FilterType {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}

class CategoryDto {
  @IsNumber() id!: number;
  @IsString() name!: string;
  @IsNumber() amount!: number;
}

class AmountDto {
  @IsNumber() ltr!: number;
  @IsNumber() amount!: number;
}

export class CreateHomeDto {
  @IsEnum(FilterType)
  filterType!: FilterType;

  @IsDateString() date!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  categories!: CategoryDto[];

  @ValidateNested() @Type(() => AmountDto) sale!: AmountDto;
  @ValidateNested() @Type(() => AmountDto) collection!: AmountDto;
  @ValidateNested() @Type(() => AmountDto) collected!: AmountDto;
  @ValidateNested() @Type(() => AmountDto) deposited!: AmountDto;
  @ValidateNested() @Type(() => AmountDto) diff!: AmountDto;

  @IsNumber() salesTarget!: number;
  @IsNumber() saleLastMonth!: number;
  @IsNumber() expensesLastMonth!: number;
}
