import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SuperAdminSignupDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  mobile!: string;

  @IsString()
  password!: string;
}

export class SuperAdminLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;
}
