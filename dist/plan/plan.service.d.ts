import { Model } from "mongoose";
import { Plan, PlanDocument } from "./plan.schema";
export declare class PlanService {
    private planModel;
    constructor(planModel: Model<PlanDocument>);
    getAllPlans(): Promise<(import("mongoose").Document<unknown, {}, PlanDocument> & Plan & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getPlanByType(type: string): Promise<(import("mongoose").Document<unknown, {}, PlanDocument> & Plan & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
