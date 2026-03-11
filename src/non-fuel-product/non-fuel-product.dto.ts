import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
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
}

export class CreateNonFuelProductsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NonFuelProductDto)
  nonFuelProducts!: NonFuelProductDto[];
}
