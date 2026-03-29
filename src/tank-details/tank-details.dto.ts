import {
  IsArray,
  IsMongoId,
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

  @IsMongoId()
  fuelProductId!: string;

  @IsString()
  capacityKl!: string;

  @IsString()
  dsrTankStock!: string;

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

  @IsMongoId()
  @IsOptional()
  fuelProductId?: string;

  @IsOptional()
  @IsString()
  capacityKl?: string;

  @IsOptional()
  @IsString()
  dsrTankStock?: string;

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
