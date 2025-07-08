export declare class SuperAdminSignupDto {
    name: string;
    email: string;
    mobile: string;
    password: string;
}
export declare class SuperAdminLoginDto {
    email: string;
    password: string;
}
export declare class CreatePlanDto {
    label: string;
    description: string;
    price: string;
    period: string;
    type: "free" | "monthly" | "quarterly" | "yearly";
    isActive: boolean;
}
