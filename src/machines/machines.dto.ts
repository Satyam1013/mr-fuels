import { IsNotEmpty, IsString, IsBoolean } from "class-validator";

export class CreateMachineDto {
  @IsString()
  @IsNotEmpty()
  machineNo!: string;

  @IsString()
  @IsNotEmpty()
  nozzleNo!: string;

  @IsString()
  @IsNotEmpty()
  fuelType!: string;

  @IsBoolean()
  isActive?: boolean;
}
