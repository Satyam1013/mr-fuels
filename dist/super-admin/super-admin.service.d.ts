import { Model } from "mongoose";
import { Plan, PlanDocument } from "src/plan/plan.schema";
import { CreatePlanDto } from "./super-admin.dto";
export declare class SuperAdminService {
    private planModel;
    constructor(planModel: Model<PlanDocument>);
    addPlan(dto: CreatePlanDto): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, PlanDocument> & Plan & import("mongoose").Document<unknown, any, any> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
}
