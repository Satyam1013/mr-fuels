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
