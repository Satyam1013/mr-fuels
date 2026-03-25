/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Types } from "mongoose";
import { AuthUser } from "../admin/admin.enum";

export const GetUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthUser = request.user;

    if (!user) return null;

    const value = data ? user?.[data] : user;

    // ✅ convert string → ObjectId safely
    if ((data === "_id" || data === "adminId") && typeof value === "string") {
      return new Types.ObjectId(value);
    }

    return value;
  },
);
