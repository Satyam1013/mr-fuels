import { AuthService } from "./auth.service";
import { CreateAdminDto, CreateUserDto } from "./create-user.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    adminSignup(body: CreateAdminDto): Promise<{
        message: string;
        admin: {
            businessEmail: string;
            businessName: string;
            mobileNo: number;
        };
    }>;
    adminLogin(email: string, password: string): Promise<{
        message: string;
        access_token: string;
    }>;
    managerLogin(username: string, password: string): Promise<{
        message: string;
        access_token: string;
        manager: {
            username: string;
            mobile: string;
            role: import("../user/user.schema").UserRole.MANAGER;
            shift: number;
            aadharImage: string;
        };
    }>;
    createManager(body: CreateUserDto): Promise<{
        message: string;
        manager: {
            username: string;
            mobile: string;
            role: import("../user/user.schema").UserRole;
            aadharImage: string;
            shift: number;
        };
    }>;
}
