import { Types } from "mongoose";

export enum ShiftStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export type FuelProduct = {
  liters: number;
  amount: number;
};

export interface GetDashboardDataParams {
  adminId: Types.ObjectId;
  date: string;
  shiftNumber: number;
  nozzleNumber?: number;
}

export type FilterType = "weekly" | "monthly" | "custom";

export interface GetSalesReportParams {
  adminId: Types.ObjectId;
  filterType: FilterType;
  startDate: string; // "2026-03-10"
  endDate: string; // "2026-03-15"
}

export interface NozzleLean {
  nozzleNumber: number;
  fuelProductId?: Types.ObjectId;
  fuelType?: string; // purana data fallback
  price?: number; // purana data fallback
  isActive: boolean;
  tankId: Types.ObjectId;
}
