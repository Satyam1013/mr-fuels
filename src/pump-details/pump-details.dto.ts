import {
  IsArray,
  IsNumber,
  IsString,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Type } from "class-transformer";

class PumpProductDto {
  @IsString()
  productName!: string;

  @IsString()
  kl!: string;

  @IsString()
  dsrTankStock!: string;

  @IsString()
  price!: string;
}

class PumpTimeDto {
  @IsString()
  start!: string;

  @IsString()
  end!: string;
}

export class CreatePumpDetailsDto {
  @IsString()
  fuelPartner!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PumpProductDto)
  pumpProducts!: PumpProductDto[];

  @IsArray()
  @IsString({ each: true })
  selectedOptions!: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => PumpTimeDto)
  pumpTime?: PumpTimeDto;

  @IsOptional()
  @IsNumber()
  pumpHours?: number;

  @IsOptional()
  @IsString()
  dailyCloseReportTime?: string;
}
