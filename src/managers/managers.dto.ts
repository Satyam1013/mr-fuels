import { IsNumber, IsString } from "class-validator";

export class CreateManagerDto {
  @IsString()
  managerName!: string;

  @IsString()
  phone!: string;

  @IsString()
  managerAadhar!: string;

  @IsNumber()
  shift!: number;

  @IsString()
  salary!: string;

  @IsString()
  password!: string;
}
