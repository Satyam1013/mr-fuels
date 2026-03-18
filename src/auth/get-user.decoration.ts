/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Types } from "mongoose";

export const GetUser = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) return null;

    const value = data ? user?.[data] : user;

    if (data === "adminId" && typeof value === "string") {
      return new Types.ObjectId(value);
    }

    return value;
  },
);
