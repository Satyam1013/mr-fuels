import { PlanService } from "./plan.service";
import { CreatePlanDto, UpdatePlanDto } from "./plan.dto";
export declare class PlanController {
    private readonly planService;
    constructor(planService: PlanService);
    create(dto: CreatePlanDto): any;
    update(id: string, dto: UpdatePlanDto): any;
    findAll(): any;
    findByType(type: string): any;
}
