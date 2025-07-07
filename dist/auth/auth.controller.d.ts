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
    logout(body: {
        mobileNo: string;
        role: "admin" | "manager";
    }): Promise<{
        message: string;
    }>;
}
