import { Document, Types } from "mongoose";
export declare class Manager {
    _id: Types.ObjectId;
    name: string;
    mobile: string;
    aadhar: object;
    shift: number;
    password: string;
    refreshToken?: string | null;
}
export declare class Admin {
    businessName: string;
    businessEmail: string;
    mobileNo: string;
    fuelTypes: string[];
    fuels: any[];
    machines: any[];
    businessUpiApps: string[];
    swipeStatement: string;
    bankDeposit: string;
    noOfEmployeeShifts: number;
    shiftDetails: number;
    managers: Manager[];
    password: string;
    refreshToken?: string | null;
    planType: "free" | "monthly" | "yearly";
    freeTrial: boolean;
    freeTrialAttempt: boolean;
    paidUser: boolean;
    activeAccount: boolean;
    startDate: Date;
    planExpiresAt: Date;
}
export type AdminDocument = Admin & Document;
export declare const AdminSchema: import("mongoose").Schema<Admin, import("mongoose").Model<Admin, any, any, any, Document<unknown, any, Admin> & Admin & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Admin, Document<unknown, {}, import("mongoose").FlatRecord<Admin>> & import("mongoose").FlatRecord<Admin> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
