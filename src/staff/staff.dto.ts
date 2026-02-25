import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateStaffDto {
  @IsString()
  staffName!: string;

  @IsString()
  staffNumber!: string;

  @IsOptional()
  @IsString()
  staffAadhar?: string;

  @IsOptional()
  @IsString()
  staffPan?: string;

  @IsNumber()
  shift!: number;

  @IsString()
  salary!: string;
}
export class BulkCreateStaffDto {
  @IsNumber()
  numberOfStaff!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStaffDto)
  staff!: CreateStaffDto[];
}
