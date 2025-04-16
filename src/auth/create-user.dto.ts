/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PartialType } from "@nestjs/mapped-types";
import { UserRole } from "src/user/user.schema";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  mobile: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
