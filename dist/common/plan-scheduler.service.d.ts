import { AdminDocument } from "src/admin/admin.schema";
import { Model } from "mongoose";
export declare class PlanSchedulerService {
    private adminModel;
    private readonly logger;
    constructor(adminModel: Model<AdminDocument>);
    handlePlanUpgrade(): Promise<void>;
}
