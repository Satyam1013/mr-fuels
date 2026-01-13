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
import {
  PlanName,
  PlanStatus,
  DurationType,
  Currency,
} from "./plan-details.enums";

export class DurationDto {
  @IsEnum(DurationType)
  type!: DurationType;

  @IsNumber()
  months!: number;
}

export class PricingDto {
  @IsNumber()
  originalPrice!: number;

  @IsNumber()
  finalPrice!: number;

  @IsEnum(Currency)
  currency!: Currency;

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

export class PlanDetailsDto {
  @IsString()
  id!: string;

  @IsEnum(PlanName)
  name!: PlanName;

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

  @IsOptional()
  @ValidateNested()
  @Type(() => TagsDto)
  tags?: TagsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UiDto)
  ui?: UiDto;

  @IsEnum(PlanStatus)
  status!: PlanStatus;
}
