import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Gender } from "../common/types";

export class CreateStaffDto {
  @IsString()
  staffName!: string;

  @IsString()
  staffNumber!: string;

  @IsOptional()
  @IsString()
  staffAadhar?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

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

export class UpdateStaffDto extends PartialType(CreateStaffDto) {}
