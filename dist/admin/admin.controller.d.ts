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
}
