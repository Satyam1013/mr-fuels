import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";

class TankDto {
  @IsString()
  capacityKl!: string;

  @IsString()
  dsrTankStock!: string;

  @IsString()
  fuelType!: string;

  @IsString()
  price!: number;

  @IsNumber()
  tankNo!: number;
}

export class CreateTankDetailsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TankDto)
  tanks!: TankDto[];
}

export class UpdateTankDetailsDto extends PartialType(CreateTankDetailsDto) {}
