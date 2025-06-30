import { AuthService } from "./auth.service";
import { CreateAdminDto } from "./create-user.dto";
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
    adminLogin(mobileNo: string, password: string): Promise<{
        message: string;
        access_token: string;
        refresh_token: string;
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
    refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
    }>;
}
