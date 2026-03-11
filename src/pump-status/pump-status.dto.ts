import { IsNumber, IsString, IsEnum, IsMongoId } from "class-validator";

export class CreatePumpStatusDto {
  @IsNumber()
  machineNo!: number;

  @IsString()
  nozzleNumber!: string;

  @IsString()
  fuelType!: string;

  @IsEnum(["active", "inactive", "maintenance"])
  status!: string;

  @IsMongoId()
  handledBy!: string;
}
