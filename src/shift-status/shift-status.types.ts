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
  date: string;
  shifts: PopulatedShift[];
  currentShift: PopulatedShift;
  dailyClose: boolean;
  pumpStatus: PumpStatusEnum;
};
