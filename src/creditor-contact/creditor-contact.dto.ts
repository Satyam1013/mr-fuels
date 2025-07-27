import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateCreditorContactDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" })
  number!: string;
}

export class UpdateCreditorContactDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Matches(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" })
  number?: string;
}
