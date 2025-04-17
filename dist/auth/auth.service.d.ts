import { UserDocument } from "src/user/user.schema";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { AdminDocument } from "src/admin/admin.schema";
export declare class AuthService {
    private adminModel;
    private userModel;
    private jwtService;
    constructor(adminModel: Model<AdminDocument>, userModel: Model<UserDocument>, jwtService: JwtService);
    adminSignup(email: string, password: string): Promise<{
        message: string;
        admin: {
            email: string;
        };
    }>;
    adminLogin(email: string, password: string): Promise<{
        message: string;
        access_token: string;
    }>;
    managerLogin(username: string, password: string): Promise<{
        message: string;
        access_token: string;
    }>;
}
