"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUser = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
exports.GetUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user)
        return null;
    const value = data ? user?.[data] : user;
    // ✅ convert string → ObjectId safely
    if ((data === "_id" || data === "adminId") && typeof value === "string") {
        return new mongoose_1.Types.ObjectId(value);
    }
    return value;
});
