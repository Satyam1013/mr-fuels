import { Request as ExpressRequest } from "express";
import { Types } from "mongoose";
export interface AuthenticatedRequest extends ExpressRequest {
    user: {
        _id: Types.ObjectId;
    };
}
