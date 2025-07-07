import { PlanService } from "./plan.service";
import { CreatePlanDto, UpdatePlanDto } from "./plan.dto";
export declare class PlanController {
    private readonly planService;
    constructor(planService: PlanService);
    create(dto: CreatePlanDto): Promise<import("mongoose").Document<unknown, {}, import("./plan.schema").PlanDocument> & import("./plan.schema").Plan & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    update(id: string, dto: UpdatePlanDto): Promise<import("mongoose").Document<unknown, {}, import("./plan.schema").PlanDocument> & import("./plan.schema").Plan & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
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
