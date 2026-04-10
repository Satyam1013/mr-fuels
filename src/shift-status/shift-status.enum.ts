import { Types } from "mongoose";

export enum ShiftStatusEnum {
  ACTIVE = "active",
  PENDING = "pending",
  COMPLETED = "completed",
}

export enum PumpStatusEnum {
  OPEN = "open",
  CLOSED = "closed",
  HOLIDAY = "holiday",
}

export interface StaffEntry {
  staffId: Types.ObjectId;
  machineId: Types.ObjectId;
  staffName: string;
  nozzleNumber: number;
  fuelType: string | null;
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
