import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsMongoId,
} from "class-validator";

export class CreatePlanDto {
  @IsString()
  label!: string;

  @IsString()
  description!: string;

  @IsString()
  price!: string;

  @IsString()
  period!: string;

  @IsEnum(["free", "monthly", "quarterly", "yearly"])
  type!: "free" | "monthly" | "quarterly" | "yearly";

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class SelectPlanDto {
  @IsMongoId()
  planId!: string;
}

export class UpdatePlanDto extends CreatePlanDto {}
