export const PlanEnum = {
  FREE: "free",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  YEARLY: "yearly",
} as const;

export type PlanEnumType = (typeof PlanEnum)[keyof typeof PlanEnum];
