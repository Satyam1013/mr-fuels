import { IsEnum } from "class-validator";

export enum PlanType {
  FREE = "free",
  MONTHLY = "monthly",
  YEARLY = "yearly",
}

export class SelectPlanDto {
  @IsEnum(PlanType, { message: "Plan must be free, monthly, or yearly" })
  plan: PlanType;
}
