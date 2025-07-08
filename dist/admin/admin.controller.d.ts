import { AdminService } from "./admin.service";
import { SelectPlanDto } from "src/plan/plan.dto";
import { AuthenticatedRequest } from "src/auth/auth.request";
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    updatePlan(req: AuthenticatedRequest, dto: SelectPlanDto): Promise<{
        message: string;
        expiresAt: Date;
    }>;
    getProfile(req: AuthenticatedRequest): Promise<{
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
            manager?: undefined;
            admin?: undefined;
        };
    } | {
        role: string;
        data: {
            manager: {
                name: string;
                mobile: string;
                shift: number;
            };
            admin: {
                businessEmail: string;
                businessName: string;
                freeTrial: boolean;
                paidUser: boolean;
                activeAccount: boolean;
                plan: {
                    label: string;
                    type: "free" | "monthly" | "quarterly" | "yearly";
                    price: string;
                    period: string;
                };
            };
            businessEmail?: undefined;
            businessName?: undefined;
            mobileNo?: undefined;
            startDate?: undefined;
            freeTrial?: undefined;
            freeTrialAttempt?: undefined;
            paidUser?: undefined;
            activeAccount?: undefined;
            plan?: undefined;
        };
    }>;
}
