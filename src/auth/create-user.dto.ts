import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class FuelDto {
  @IsString()
  value!: string;

  @IsNumber()
  @Type(() => Number)
  kl!: number;

  @IsNumber()
  @Type(() => Number)
  diameter!: number;

  @IsNumber()
  @Type(() => Number)
  radius!: number;

  @IsNumber()
  @Type(() => Number)
  length!: number;

  @IsOptional()
  @IsObject()
  pdf?: object;
}

export class BusinessDetailsDto {
  @IsString()
  businessName!: string;

  @IsEmail()
  businessEmail!: string;

  @IsString()
  businessPhoneNo!: string;

  @IsArray()
  @IsString({ each: true })
  fuelTypes!: string[];

  @ValidateNested({ each: true })
  @Type(() => FuelDto)
  fuels!: FuelDto[];
}

export class NozzleDto {
  @IsString()
  nozzleType!: string;
}

export class MachineDto {
  @IsNumber()
  @Type(() => Number)
  machineNo!: number;

  @IsNumber()
  @Type(() => Number)
  nozzleCount!: number;

  @ValidateNested({ each: true })
  @Type(() => NozzleDto)
  nozzles!: NozzleDto[];
}

export class MachineDetailsDto {
  @IsNumber()
  @Type(() => Number)
  numberOfMachines!: number;

  @ValidateNested({ each: true })
  @Type(() => MachineDto)
  machines!: MachineDto[];
}

export class PumpDetailsDto {
  @IsArray()
  @IsString({ each: true })
  businessUpiApps!: string[];

  @IsString()
  swipeStatement!: string;

  @IsString()
  bankDeposit!: string;

  @IsNumber()
  @Type(() => Number)
  noOfEmployeeShifts!: number;

  @IsNumber()
  @Type(() => Number)
  shiftDetails!: number;
}

export class ManagerDto {
  @IsString()
  name!: string;

  @IsString()
  mobile!: string;

  @IsNumber()
  @Type(() => Number)
  shift!: number;

  @IsOptional()
  @IsObject()
  aadhar?: object;

  @IsString()
  password!: string;
}

export class CreateAdminDtoDemo {
  @ValidateNested()
  @Type(() => BusinessDetailsDto)
  businessDetails!: BusinessDetailsDto;

  @ValidateNested()
  @Type(() => MachineDetailsDto)
  machineDetails!: MachineDetailsDto;

  @ValidateNested()
  @Type(() => PumpDetailsDto)
  pumpDetails!: PumpDetailsDto;

  @ValidateNested({ each: true })
  @Type(() => ManagerDto)
  @IsArray()
  managers!: ManagerDto[];

  @IsString()
  adminPassword!: string;
}

export class LoginDto {
  @IsString()
  mobileNo!: string;

  @IsString()
  password!: string;
}

export class CreateStaffDto {
  @IsString() name!: string;
  @IsString() role!: string;
  @IsNumber() shift!: number;
  @IsString() salaryType!: string;
  @IsNumber() salary!: number;
  @IsDateString() dateJoined!: string;

  @IsBoolean() paidLeave!: boolean;
  @IsBoolean() salaryPending!: boolean;

  @IsOptional() document?: { name: string; file: any };
}

export enum SalaryMode {
  FULL = "fullSalary",
  MINUS_CREDIT = "minusCredit",
  CUSTOM = "customSalary",
}

export class CreditSalaryDto {
  @IsNumber()
  @Type(() => Number)
  amount!: number;

  @IsArray()
  @Type(() => Number)
  pendingIds!: number[];

  @IsEnum(SalaryMode)
  mode!: SalaryMode;
}

export class AddCreditDto {
  @IsNumber()
  @Type(() => Number)
  amount!: number;
}

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  businessName!: string;

  @IsString()
  @IsNotEmpty()
  dealerCode!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;
  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;
  @IsObject()
  pumpDetails!: Record<string, any>;
}

export class AdminLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
