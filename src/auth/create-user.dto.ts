import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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
  mobileNo!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword!: string;
}

export class AdminLoginDto {
  @IsString()
  mobileNo!: string;

  @IsString()
  password!: string;
}
