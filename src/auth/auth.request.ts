import { Request } from "express";
import { AuthUser } from "./user.type";

export interface AuthenticatedRequest extends Request {
  user: AuthUser;
}
