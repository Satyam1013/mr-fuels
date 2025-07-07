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
        data: {
            businessEmail: string;
            businessName: string;
            mobileNo: string;
            startDate: Date;
            freeTrial: boolean;
            freeTrialAttempt: boolean;
            paidUser: boolean;
            activeAccount: boolean;
            plan: {
                label: string;
                type: "free" | "monthly" | "quarterly" | "yearly";
                price: string;
                period: string;
            };
            name?: undefined;
            shift?: undefined;
        };
    } | {
        message: string;
        access_token: string;
        refresh_token: string;
        role: string;
        data: {
            name: string;
            shift: number;
            businessEmail: string;
            businessName: string;
            mobileNo: string;
            freeTrial: boolean;
            paidUser: boolean;
            activeAccount: boolean;
            plan: {
                label: string;
                type: "free" | "monthly" | "quarterly" | "yearly";
                price: string;
                period: string;
            };
            startDate?: undefined;
            freeTrialAttempt?: undefined;
        };
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    logout(mobileNo: string, role: "admin" | "manager"): Promise<{
        message: string;
    }>;
}
