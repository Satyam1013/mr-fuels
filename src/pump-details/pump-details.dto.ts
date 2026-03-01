import { IsMongoId, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

class PumpTimeDto {
  @IsString()
  start!: string;

  @IsString()
  end!: string;
}

export class CreatePumpDetailsDto {
  @IsString()
  fuelPartner!: string;

  @IsNumber()
  pumpHours!: number;

  @IsNumber()
  numberOfShifts!: number;

  @IsMongoId()
  tank!: string;

  @ValidateNested()
  @Type(() => PumpTimeDto)
  pumpTime!: PumpTimeDto;

  @IsString()
  dailyCloseReportTime!: string;

  @Type(() => Boolean)
  is24Hour?: boolean;
}
