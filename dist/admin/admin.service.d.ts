import { AdminDocument } from "./admin.schema";
import { Model } from "mongoose";
import { SelectPlanDto } from "src/plan/plan.dto";
import { PlanDocument } from "src/plan/plan.schema";
export declare class AdminService {
    private adminModel;
    private planModel;
    constructor(adminModel: Model<AdminDocument>, planModel: Model<PlanDocument>);
    selectPlan(adminId: string, dto: SelectPlanDto): Promise<{
        message: string;
        expiresAt: Date;
    }>;
    getProfile(user: {
        role: string;
        mobileNo: string;
        adminId?: string;
        sub: string;
    }): Promise<{
        role: string;
        data: {
            businessEmail: string;
            businessName: string;
            mobileNo: string;
            startDate: Date;
            freeTrial: boolean;
            freeTrialAttempt: boolean;
            paidUser: boolean;
            activeAccount: boolean;
            plan: {
                label: string;
                type: "free" | "monthly" | "quarterly" | "yearly";
                price: string;
                period: string;
            };
            manager?: undefined;
            admin?: undefined;
        };
    } | {
        role: string;
        data: {
            manager: {
                name: string;
                mobile: string;
                shift: number;
            };
            admin: {
                businessEmail: string;
                businessName: string;
                freeTrial: boolean;
                paidUser: boolean;
                activeAccount: boolean;
                plan: {
                    label: string;
                    type: "free" | "monthly" | "quarterly" | "yearly";
                    price: string;
                    period: string;
                };
            };
            businessEmail?: undefined;
            businessName?: undefined;
            mobileNo?: undefined;
            startDate?: undefined;
            freeTrial?: undefined;
            freeTrialAttempt?: undefined;
            paidUser?: undefined;
            activeAccount?: undefined;
            plan?: undefined;
        };
    }>;
}
