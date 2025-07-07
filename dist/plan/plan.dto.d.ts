export declare class CreatePlanDto {
    label: string;
    description: string;
    price: string;
    period: string;
    type: "free" | "monthly" | "quarterly" | "yearly";
    isActive?: boolean;
}
export declare class SelectPlanDto {
    planId: string;
}
export declare class UpdatePlanDto extends CreatePlanDto {
}
