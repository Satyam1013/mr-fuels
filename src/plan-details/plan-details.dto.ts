import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class DurationDto {
  @IsEnum(["trial", "monthly", "yearly"])
  type!: "trial" | "monthly" | "yearly";

  @IsNumber()
  months!: number;
}

export class PricingDto {
  @IsNumber()
  originalPrice!: number;

  @IsNumber()
  finalPrice!: number;

  @IsString()
  currency!: "INR";

  @IsBoolean()
  isFree!: boolean;
}

export class TrialDto {
  @IsBoolean()
  enabled!: boolean;

  @IsOptional()
  @IsNumber()
  trialDays?: number;
}

export class TagsDto {
  @IsOptional()
  @IsBoolean()
  mostPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  discounted?: boolean;

  @IsOptional()
  @IsBoolean()
  freeTrial?: boolean;
}

export class UiDto {
  @IsOptional()
  @IsString()
  badgeText?: string;

  @IsOptional()
  @IsString()
  badgeColor?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  gradient?: string[];
}

// Main DTO
export class PlanDetailsDto {
  @IsString()
  id!: string;

  @IsEnum(["pro", "premium"])
  name!: "pro" | "premium";

  @IsNumber()
  tier!: number;

  @IsString()
  description!: string;

  @ValidateNested()
  @Type(() => DurationDto)
  duration!: DurationDto;

  @ValidateNested()
  @Type(() => PricingDto)
  pricing!: PricingDto;

  @ValidateNested()
  @Type(() => TrialDto)
  trial!: TrialDto;

  @IsArray()
  @IsString({ each: true })
  features!: string[];

  @ValidateNested()
  @Type(() => TagsDto)
  @IsOptional()
  tags?: TagsDto;

  @ValidateNested()
  @Type(() => UiDto)
  @IsOptional()
  ui?: UiDto;

  @IsEnum(["active", "inactive"])
  status!: "active" | "inactive";
}
