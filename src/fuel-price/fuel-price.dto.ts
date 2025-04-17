import { IsNumber, IsOptional } from "class-validator";

export class UpdateFuelPriceDto {
  @IsOptional()
  @IsNumber()
  petrol?: number;

  @IsOptional()
  @IsNumber()
  diesel?: number;

  @IsOptional()
  @IsNumber()
  power?: number;
}
