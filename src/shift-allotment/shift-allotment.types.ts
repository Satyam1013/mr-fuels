import { Types } from "mongoose";

export interface ShiftAllotmentResult {
  _id: Types.ObjectId;
  adminId: Types.ObjectId;
  shiftId: string;
  managers: {
    _id: Types.ObjectId;
    managerName: string;
    phone: string;
    shift: number;
  }[];
  machines: {
    machineId: string;
    machineInfo: Record<string, unknown> | null;
    nozzles: {
      nozzleId: string;
      nozzleStatus: string;
      inactiveStatus: string | null;
      staffId: Types.ObjectId;
      staffInfo: Record<string, unknown> | null;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}
