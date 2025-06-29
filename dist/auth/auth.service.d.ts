import { UserDocument } from "src/user/user.schema";
import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { AdminDocument } from "src/admin/admin.schema";
import { CreateAdminDto } from "./create-user.dto";
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
            mobileNo: string;
        };
    }>;
    adminLogin(mobileNo: string, password: string): Promise<{
        message: string;
        access_token: string;
    }>;
    createManager(body: any): Promise<{
        message: string;
        manager: {
            managerName: string;
            managerMobile: string;
            shift: string;
        };
    }>;
    managerLogin(managerName: string, managerPassword: string): Promise<{
        message: string;
        access_token: string;
        manager: {
            managerName: string;
            managerMobile: string;
            shift: string;
        };
    }>;
}
