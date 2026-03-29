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
  nozzleNumber: number;
}
