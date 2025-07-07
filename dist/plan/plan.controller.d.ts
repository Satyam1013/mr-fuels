import { PlanService } from "./plan.service";
export declare class PlanController {
    private readonly planService;
    constructor(planService: PlanService);
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./plan.schema").PlanDocument> & import("./plan.schema").Plan & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findByType(type: string): Promise<(import("mongoose").Document<unknown, {}, import("./plan.schema").PlanDocument> & import("./plan.schema").Plan & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | null>;
}
