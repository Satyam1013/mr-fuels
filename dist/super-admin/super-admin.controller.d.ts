import { SuperAdminService } from "./super-admin.service";
import { CreatePlanDto } from "./super-admin.dto";
export declare class SuperAdminController {
    private readonly superAdminService;
    constructor(superAdminService: SuperAdminService);
    addPlan(dto: CreatePlanDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../plan/plan.schema").PlanDocument> & import("../plan/plan.schema").Plan & import("mongoose").Document<unknown, any, any> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}
