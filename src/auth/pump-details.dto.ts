import { IsOptional, IsArray, IsString } from "class-validator";

export class CreatePumpDetailsDto {
  @IsString()
  @IsOptional()
  signupId!: string | null;

  @IsString()
  businessName!: string;

  @IsString()
  dealerCode!: string;

  @IsString()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  password!: string;

  @IsString()
  confirmPassword!: string;

  @IsString()
  bankDeposit!: string;

  @IsString()
  fuelPartner!: string;

  @IsArray()
  machines!: any[];

  @IsArray()
  managers!: any[];

  @IsArray()
  staff!: any[];

  @IsArray()
  pumpProducts!: any[];

  @IsArray()
  selectedOptions!: string[];

  @IsArray()
  selectedProducts!: string[];

  @IsArray()
  tankConfig!: any[];

  @IsArray()
  upiApp!: string[];

  @IsArray()
  upiApps!: string[];

  @IsString()
  swipeSettlement!: string;

  @IsString()
  swipeStatement!: string;
}
