import { Types } from "mongoose";

export const PlanEnum = {
  FREE: "free",
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  YEARLY: "yearly",
} as const;

export type PlanEnumType = (typeof PlanEnum)[keyof typeof PlanEnum];

export interface Employee {
  _id: Types.ObjectId;
  name: string;
  salary?: number;
  salaryType?: string;
  salaryPending?: boolean;
  credit?: number;
  creditLeft?: number;
  paidLeave?: boolean;
  dateJoined?: Date;
  role?: string;
  shift?: number;
  document?: any;
  pendingSalaryRecords?: any[];
}
