import { Model } from "mongoose";
import { Plan, PlanDocument } from "./plan.schema";
import { CreatePlanDto, UpdatePlanDto } from "./plan.dto";
export declare class PlanService {
    private planModel;
    constructor(planModel: Model<PlanDocument>);
    createPlan(dto: CreatePlanDto): Promise<import("mongoose").Document<unknown, {}, PlanDocument> & Plan & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updatePlan(id: string, dto: UpdatePlanDto): Promise<import("mongoose").Document<unknown, {}, PlanDocument> & Plan & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
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
