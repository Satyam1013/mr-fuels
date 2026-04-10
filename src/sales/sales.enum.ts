import { Types } from "mongoose";
import { StaffEntry } from "../shift-status/shift-status.enum";

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
}

export type FilterType = "weekly" | "monthly" | "custom" | "daily";

export interface NozzleLean {
  nozzleNumber: number;
  fuelProductId?: Types.ObjectId;
  fuelType?: string;
  price?: number;
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

export interface DailyRecord {
  date: string;
  shifts: { shiftNumber: number; shiftStatus: string }[];
  overallSales: { liters: number; amount: number };
  netSales: { liters: number; amount: number };
  testing: { liters: number; amount: number };
  overallCreditorsAmount: number;
  prepaid: number;
  pumpExpenses: number;
  personalExpenses: number;
  lubricantSales: number;
  transactions: { upi: number; pos: number };
  nozzleMap: Map<number, NozzleSnapshot>;
}

export type GetSalesReportParams =
  | {
      type: "single";
      adminId: Types.ObjectId;
      date: string;
      shiftNumber: number;
    }
  | {
      type: "range";
      adminId: Types.ObjectId;
      filterType: FilterType;
      startDate: string;
      endDate: string;
      calculationMode: "shiftwise" | "dailyCalculation";
    };

export interface DailyRecord {
  date: string;
  shifts: { shiftNumber: number; shiftStatus: string }[];
  overallSales: { liters: number; amount: number };
  netSales: { liters: number; amount: number };
  testing: { liters: number; amount: number };
  overallCreditorsAmount: number;
  prepaid: number;
  pumpExpenses: number;
  personalExpenses: number;
  lubricantSales: number;
  transactions: { upi: number; pos: number };
  nozzleMap: Map<number, NozzleSnapshot>;
  staffMap: Map<string, StaffEntry>;
}
