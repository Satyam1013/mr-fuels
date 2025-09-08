import { IsDateString, IsObject } from "class-validator";

export class CreateDSRDto {
  @IsDateString()
  date!: string;

  @IsObject()
  manualDip!: Record<string, number>;
  // e.g. { Petrol: 123, Diesel: 456 }

  @IsObject()
  receipt!: Record<string, number>;
  // e.g. { Petrol: 200, Diesel: 300 }

  @IsObject()
  pumpTesting!: Record<string, number>;
  // e.g. { Petrol: 50, Diesel: 80 }

  @IsObject()
  meterReading!: Record<string, Record<string, number>>;
  // e.g. { Machine1: { Petrol: 123, Diesel: 456 }, Machine2: { Petrol: 789 } }
}
