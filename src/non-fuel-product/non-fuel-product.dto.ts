import { IsNotEmpty, IsString, IsBoolean, IsOptional } from "class-validator";

export class CreateNonFuelProductDto {
  @IsString()
  @IsNotEmpty()
  productName!: string;

  @IsString()
  @IsNotEmpty()
  price!: string;

  @IsString()
  @IsNotEmpty()
  totalStock!: string;

  @IsString()
  @IsNotEmpty()
  unitType!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
