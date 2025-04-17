import { IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  @MinLength(1, { message: "Mobile number must be a valid string" })
  email: string;

  @IsString()
  @MinLength(4, { message: "Password must be at least 4 characters long" })
  password: string;
}

export class AdminLoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
