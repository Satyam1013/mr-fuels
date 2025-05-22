/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { UserRole } from "src/user/user.schema";
import { Type } from "class-transformer";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  managerName: string;

  @IsString()
  @IsNotEmpty()
  managerPassword: string;

  @IsString()
  @IsNotEmpty()
  managerMobile: string;

  @IsString()
  @IsNotEmpty()
  shift: string;

  @IsEnum(UserRole)
  role: UserRole;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class NozzleDto {
  @IsString()
  nozzleType: string;
}

export class MachineDto {
  @IsString()
  machineNo: string;

  @IsNumber()
  @Type(() => Number)
  nozzleCount: number;

  @ValidateNested({ each: true })
  @Type(() => NozzleDto)
  nozzles: NozzleDto[];
}

export class TankDto {
  @IsString()
  type: string;

  @IsNumber()
  @Type(() => Number)
  number: number;
}

export class CreateAdminDto {
  @IsString()
  businessName: string;

  @IsEmail()
  businessEmail: string;

  @IsString()
  mobileNo: string;

  @IsString()
  password: string;

  @ValidateNested({ each: true })
  @Type(() => TankDto)
  tankCapacity: TankDto[];

  @ValidateNested({ each: true })
  @Type(() => MachineDto)
  machines: MachineDto[];
}
