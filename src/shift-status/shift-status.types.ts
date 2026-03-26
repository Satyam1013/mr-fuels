import { Types } from "mongoose";
import { PumpStatusEnum, ShiftStatusEnum } from "./shift-status.enum";
import { Role } from "../admin/admin.enum";

export interface PumpDetailsLean {
  numberOfShifts: number;
  pumpTime: {
    start: string;
  };
}

export type PopulatedShift = {
  shiftNumber: number;
  name: string;
  startTime?: string;
  endTime?: string;
  status: ShiftStatusEnum;
  closedBy?: ClosedByType;
  closedByModel?: Role;
};

type ClosedByType =
  | {
      _id: Types.ObjectId;
      name?: string;
    }
  | Types.ObjectId
  | null;

export type ShiftStatusPopulated = {
  _id: Types.ObjectId;

  adminId: Types.ObjectId;
  date: string;
  totalShifts: number;

  currentShift: PopulatedShift;
  shifts: PopulatedShift[];

  dailyClose: boolean;
  pumpStatus?: PumpStatusEnum;
};
