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
    login(mobileNo: string, password: string): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
        role: string;
        admin: {
            businessEmail: string;
            businessName: string;
            plan: "free" | "paid";
            planExpiresAt: Date;
            mobileNo: string;
        };
        manager?: undefined;
    } | {
        message: string;
        access_token: string;
        refresh_token: string;
        role: string;
        manager: {
            name: string;
            shift: number;
            businessEmail: string;
            businessName: string;
            plan: "free" | "paid";
            planExpiresAt: Date;
            mobileNo: string;
        };
        admin?: undefined;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
}
