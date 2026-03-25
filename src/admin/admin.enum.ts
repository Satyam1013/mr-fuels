import { Types } from "mongoose";

export enum Role {
  ADMIN = "Admin",
  MANAGER = "Manager",
  STAFF = "Staff",
}

export interface AuthUser {
  _id: Types.ObjectId;
  adminId?: Types.ObjectId;
  role: Role;
  name?: string;
  email?: string;
}
