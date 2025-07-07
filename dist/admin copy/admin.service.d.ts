import { AdminDocument } from "./admin.schema";
import { Model } from "mongoose";
import { SelectPlanDto } from "./admin.dto";
export declare class AdminService {
    private adminModel;
    constructor(adminModel: Model<AdminDocument>);
    selectPlan(adminId: string, dto: SelectPlanDto): Promise<{
        message: string;
        expiresAt: Date;
    }>;
}
