import { Document } from "mongoose";
export declare class Plan {
    label: string;
    description: string;
    price: string;
    period: string;
    type: "free" | "monthly" | "quarterly" | "yearly";
    isActive: boolean;
}
export type PlanDocument = Plan & Document;
export declare const PlanSchema: import("mongoose").Schema<Plan, import("mongoose").Model<Plan, any, any, any, Document<unknown, any, Plan> & Plan & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Plan, Document<unknown, {}, import("mongoose").FlatRecord<Plan>> & import("mongoose").FlatRecord<Plan> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
