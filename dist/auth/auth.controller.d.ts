import { AuthService } from "./auth.service";
import { CreateAdminDto, LoginDto } from "./create-user.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    adminSignup(body: CreateAdminDto): Promise<{
        message: string;
        admin: {
            businessEmail: string;
            businessName: string;
            mobileNo: string;
        };
    }>;
    login(body: LoginDto): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
        role: string;
        admin: {
            businessEmail: string;
            businessName: string;
            mobileNo: string;
            plan: "free" | "paid";
            planExpiresAt: Date;
            startDate: Date;
            freeTrial: boolean;
            freeTrialAttempt: boolean;
            paidUser: boolean;
            activeAccount: boolean;
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
            mobileNo: string;
            plan: "free" | "paid";
            planExpiresAt: Date;
            freeTrial: boolean;
            paidUser: boolean;
            activeAccount: boolean;
        };
        admin?: undefined;
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
    logout(body: {
        mobileNo: string;
        role: "admin" | "manager";
    }): Promise<{
        message: string;
    }>;
}
