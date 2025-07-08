import { Request as ExpressRequest } from "express";

export interface AuthenticatedRequest extends ExpressRequest {
  user: {
    sub: string;
    mobileNo: string;
    role: "admin" | "manager";
    adminId?: string;
  };
}
