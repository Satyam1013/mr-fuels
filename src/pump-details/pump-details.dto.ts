import { IsArray, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class PumpProductDto {
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

  @ValidateNested()
  @Type(() => PumpTimeDto)
  pumpTime!: PumpTimeDto;

  @IsNumber()
  pumpHours!: number;

  @IsString()
  dailyCloseReportTime!: string;
}
