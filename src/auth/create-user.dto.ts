import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { UserRole } from "src/user/user.schema";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  aadharImage: string;

  @IsNumber()
  @IsNotEmpty()
  shift: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsNotEmpty()
  businessEmail: string;

  @IsNotEmpty()
  mobileNo: number;

  @IsString()
  @IsNotEmpty()
  password: string;

  tankCapacity: Record<string, string>[];

  machines: { machineNo: number; nozel: string }[];
}
