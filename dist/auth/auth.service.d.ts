import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { AdminDocument } from "src/admin/admin.schema";
import { CreateAdminDto } from "./create-user.dto";
import { ConfigService } from "@nestjs/config";
export declare class AuthService {
    private adminModel;
    private jwtService;
    private configService;
    constructor(adminModel: Model<AdminDocument>, jwtService: JwtService, configService: ConfigService);
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
        refresh_token: string;
    }>;
    managerLogin(mobileNo: string, managerPassword: string): Promise<{
        message: string;
        access_token: string;
        manager: {
            name: string;
            mobile: string;
            shift: number;
            businessEmail: string;
        };
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
}
