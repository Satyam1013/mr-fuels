import {
  ValidateNested,
  IsNumber,
  IsString,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

class FuelEntryDto {
  @IsNumber() manualDip!: number;
  @IsString() manualDipPic!: string;

  @IsNumber() receipt!: number;
  @IsString() receiptPic!: string;

  @IsNumber() meterReading!: number;
  @IsString() meterReadingPic!: string;

  @IsNumber() pumpTesting!: number;
  @IsString() pumpTestingPic!: string;
}

export class CreateDSRDto {
  @IsDateString()
  date!: string;

  @ValidateNested()
  @Type(() => FuelEntryDto)
  petrol!: FuelEntryDto;

  @ValidateNested()
  @Type(() => FuelEntryDto)
  diesel!: FuelEntryDto;

  @ValidateNested()
  @Type(() => FuelEntryDto)
  power!: FuelEntryDto;
}
