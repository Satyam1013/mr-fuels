import { Model } from "mongoose";
import { User, UserDocument } from "src/user/user.schema";
import { CreateUserDto, UpdateUserDto } from "src/auth/create-user.dto";
export declare class AdminService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    createUser(userData: CreateUserDto): Promise<import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateUser(id: string, updates: UpdateUserDto): Promise<(import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteUser(id: string): Promise<(import("mongoose").Document<unknown, {}, UserDocument> & User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
