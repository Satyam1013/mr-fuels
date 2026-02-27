import { IsEnum, IsOptional } from "class-validator";

export enum TimeFilter {
  WEEK = "week",
  MONTH = "month",
}

export class HomeQueryDto {
  @IsOptional()
  @IsEnum(TimeFilter)
  filter?: TimeFilter;
}
