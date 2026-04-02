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

export type GetSalesReportParams =
  | {
      adminId: Types.ObjectId;
      type: "single";
      date: string;
      shiftNumber: number;
    }
  | {
      adminId: Types.ObjectId;
      type: "range";
      filterType: FilterType;
      startDate: string;
      endDate: string;
    };

export interface NozzleLean {
  nozzleNumber: number;
  fuelProductId?: Types.ObjectId;
  fuelType?: string; // purana data fallback
  price?: number; // purana data fallback
  isActive: boolean;
  tankId: Types.ObjectId;
}

export interface NozzleSnapshot {
  nozzleNumber: number;
  fuelType: string | null;
  staffId: unknown;
  sales: { liters: number; amount: number };
  netSales: { liters: number; amount: number };
  testing: { liters: number; amount: number };
  creditors: number;
  prepaid: number;
  lubricantSales: number;
  transactions: { upi: number; pos: number };
  pumpExpenses: number;
  personalExpenses: number;
}

export interface MachinesSnapshot {
  nozzles: NozzleSnapshot[];
}

export interface TransactionsSnapshot {
  upi: number;
  pos: number;
}
