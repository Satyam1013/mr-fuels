import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  name!: string;

  @IsString()
  phoneNumber!: string;

  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
