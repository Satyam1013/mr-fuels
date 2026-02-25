import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class CreateManagerDto {
  @IsString()
  managerName!: string;

  @IsString()
  phone!: string;

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
