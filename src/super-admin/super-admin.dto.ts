import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from "class-validator";

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

export class CreatePlanDto {
  @IsString()
  @IsNotEmpty()
  label!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  price!: string;

  @IsString()
  @IsNotEmpty()
  period!: string;

  @IsEnum(["free", "monthly", "quarterly", "yearly"])
  type!: "free" | "monthly" | "quarterly" | "yearly";

  @IsBoolean()
  isActive!: boolean;
}
