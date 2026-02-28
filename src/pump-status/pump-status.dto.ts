import { IsNumber, IsString, IsEnum, IsMongoId } from "class-validator";

export class CreatePumpStatusDto {
  @IsNumber()
  machineNo!: number;

  @IsString()
  nozzleNo!: string;

  @IsString()
  fuelType!: string;

  @IsEnum(["active", "inactive", "maintenance"])
  status!: string;

  @IsMongoId()
  handledBy!: string;
}
