import { Request as ExpressRequest } from "express";

export interface AuthenticatedRequest extends ExpressRequest {
  user: {
    _id: string;
  };
}
