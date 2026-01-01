import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
} from "class-validator";
import { PlanEnum, PlanEnumType } from "../common/types";

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

  @IsEnum(PlanEnum)
  type!: PlanEnumType;

  @IsOptional()
  @IsBoolean()
  isActive!: boolean;
}

export class SelectPlanDto {
  @IsMongoId()
  planId!: string;
}

export class UpdatePlanDto extends CreatePlanDto {}
