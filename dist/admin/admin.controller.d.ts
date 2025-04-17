import { AdminService } from "./admin.service";
import { CreateUserDto, UpdateUserDto } from "src/auth/create-user.dto";
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    createUser(userData: CreateUserDto): Promise<import("mongoose").Document<unknown, {}, import("../user/user.schema").UserDocument> & import("../user/user.schema").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateUser(id: string, userData: UpdateUserDto): Promise<(import("mongoose").Document<unknown, {}, import("../user/user.schema").UserDocument> & import("../user/user.schema").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
    deleteUser(id: string): Promise<(import("mongoose").Document<unknown, {}, import("../user/user.schema").UserDocument> & import("../user/user.schema").User & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
