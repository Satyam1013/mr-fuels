import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    adminSignup(email: string, password: string): Promise<{
        message: string;
        admin: {
            email: string;
        };
    }>;
    adminLogin(email: string, password: string): Promise<{
        message: string;
        access_token: string;
    }>;
    managerLogin(username: string, password: string): Promise<{
        message: string;
        access_token: string;
    }>;
}
