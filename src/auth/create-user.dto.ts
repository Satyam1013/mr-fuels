import {
  IsArray,
  IsEmail,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class FuelDto {
  @IsString()
  value: string;

  @IsNumber()
  @Type(() => Number)
  kl: number;

  @IsObject()
  pdf: object;
}

export class BusinessDetailsDto {
  @IsString()
  businessName: string;

  @IsEmail()
  businessEmail: string;

  @IsString()
  businessPhoneNo: string;

  @IsArray()
  @IsString({ each: true })
  fuelTypes: string[];

  @ValidateNested({ each: true })
  @Type(() => FuelDto)
  fuels: FuelDto[];
}

export class NozzleDto {
  @IsString()
  nozzleType: string;
}

export class MachineDto {
  @IsNumber()
  @Type(() => Number)
  machineNo: number;

  @IsNumber()
  @Type(() => Number)
  nozzleCount: number;

  @ValidateNested({ each: true })
  @Type(() => NozzleDto)
  nozzles: NozzleDto[];
}

export class MachineDetailsDto {
  @IsNumber()
  @Type(() => Number)
  numberOfMachines: number;

  @ValidateNested({ each: true })
  @Type(() => MachineDto)
  machines: MachineDto[];
}

export class PumpDetailsDto {
  @IsArray()
  @IsString({ each: true })
  businessUpiApps: string[];

  @IsString()
  swipeStatement: string;

  @IsString()
  bankDeposit: string;

  @IsNumber()
  @Type(() => Number)
  noOfEmployeeShifts: number;

  @IsNumber()
  @Type(() => Number)
  shiftDetails: number;
}

export class ManagerDto {
  @IsString()
  name: string;

  @IsString()
  mobile: string;

  @IsNumber()
  @Type(() => Number)
  shift: number;

  @IsString()
  password: string;
}

export class CreateAdminDto {
  @ValidateNested()
  @Type(() => BusinessDetailsDto)
  businessDetails: BusinessDetailsDto;

  @ValidateNested()
  @Type(() => MachineDetailsDto)
  machineDetails: MachineDetailsDto;

  @ValidateNested()
  @Type(() => PumpDetailsDto)
  pumpDetails: PumpDetailsDto;

  @ValidateNested({ each: true })
  @Type(() => ManagerDto)
  @IsArray()
  managers: ManagerDto[];

  @IsString()
  adminPassword: string;
}
