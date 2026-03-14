import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Types } from "mongoose";

class TankDto {
  @IsOptional()
  _id?: Types.ObjectId;

  @IsString()
  capacityKl!: string;

  @IsString()
  dsrTankStock!: string;

  @IsString()
  fuelType!: string;

  @IsNumber()
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

export class UpdateTankDto {
  @IsOptional()
  _id?: Types.ObjectId;

  @IsOptional()
  @IsString()
  capacityKl?: string;

  @IsOptional()
  @IsString()
  dsrTankStock?: string;

  @IsOptional()
  @IsString()
  fuelType?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  tankNo?: number;
}

export class UpdateTankDetailsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateTankDto)
  tanks!: UpdateTankDto[];
}
