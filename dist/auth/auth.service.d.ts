import { UserDocument, UserRole } from "src/user/user.schema";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { AdminDocument } from "src/admin/admin.schema";
import { CreateAdminDto, CreateUserDto } from "./create-user.dto";
export declare class AuthService {
    private adminModel;
    private userModel;
    private jwtService;
    constructor(adminModel: Model<AdminDocument>, userModel: Model<UserDocument>, jwtService: JwtService);
    adminSignup(body: CreateAdminDto): Promise<{
        message: string;
        admin: {
            businessEmail: string;
            businessName: string;
            mobileNo: number;
        };
    }>;
    createManager(body: CreateUserDto): Promise<{
        message: string;
        manager: {
            username: string;
            mobile: string;
            role: UserRole;
            aadharImage: string;
            shift: number;
        };
    }>;
    adminLogin(email: string, password: string): Promise<{
        message: string;
        access_token: string;
    }>;
    managerLogin(username: string, password: string): Promise<{
        message: string;
        access_token: string;
        manager: {
            username: string;
            mobile: string;
            role: UserRole.MANAGER;
            shift: number;
            aadharImage: string;
        };
    }>;
}
