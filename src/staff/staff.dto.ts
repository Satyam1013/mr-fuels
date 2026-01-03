import { IsNumber, IsString } from "class-validator";

export class CreateStaffDto {
  @IsString()
  staffName!: string;

  @IsString()
  staffNumber!: string;

  @IsNumber()
  shift!: number;

  @IsString()
  salary!: string;
}
