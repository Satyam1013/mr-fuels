import { JwtService } from "@nestjs/jwt";
import { Model } from "mongoose";
import { AdminDocument } from "src/admin/admin.schema";
import { CreateAdminDto } from "./create-user.dto";
import { ConfigService } from "@nestjs/config";
import { SuperAdminLoginDto, SuperAdminSignupDto } from "src/super-admin/super-admin.dto";
import { SuperAdminDocument } from "src/super-admin/super-admin.schema";
export declare class AuthService {
    private adminModel;
    private superAdminModel;
    private jwtService;
    private configService;
    constructor(adminModel: Model<AdminDocument>, superAdminModel: Model<SuperAdminDocument>, jwtService: JwtService, configService: ConfigService);
    superAdminSignup(dto: SuperAdminSignupDto): Promise<{
        message: string;
    }>;
    superAdminLogin(dto: SuperAdminLoginDto): Promise<{
        message: string;
        access_token: string;
    }>;
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
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    logout(mobileNo: string, role: "admin" | "manager"): Promise<{
        message: string;
    }>;
}
