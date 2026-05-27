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

export class CreateManagerDto {
  @IsString()
  managerName!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsString()
  managerAadhar?: string;

  @IsOptional()
  @IsString()
  managerPan?: string;

  @IsNumber()
  shift!: number;

  @IsString()
  salary!: string;

  @IsString()
  password!: string;
}

export class BulkCreateManagerDto {
  @IsNumber()
  numberOfManagers!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateManagerDto)
  managers!: CreateManagerDto[];

  @IsNumber()
  numberOfShift!: number;
}

export class UpdateManagerDto extends PartialType(CreateManagerDto) {}
