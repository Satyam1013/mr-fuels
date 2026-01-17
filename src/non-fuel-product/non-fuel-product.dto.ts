import { IsNotEmpty, IsString } from "class-validator";

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
}
