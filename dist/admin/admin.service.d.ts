import { AdminDocument } from "./admin.schema";
import { Model } from "mongoose";
import { SelectPlanDto } from "src/plan/plan.dto";
import { PlanDocument } from "src/plan/plan.schema";
export declare class AdminService {
    private adminModel;
    private planModel;
    constructor(adminModel: Model<AdminDocument>, planModel: Model<PlanDocument>);
    selectPlan(adminId: string, dto: SelectPlanDto): Promise<{
        message: string;
        expiresAt: Date;
    }>;
}
