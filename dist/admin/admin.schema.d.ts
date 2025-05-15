import mongoose from "mongoose";
import { User } from "src/user/user.schema";
export type AdminDocument = Admin & Document;
export declare class Admin {
    businessName: string;
    businessEmail: string;
    mobileNo: number;
    password: string;
    tankCapacity: Record<string, string>[];
    machines: {
        machineNo: number;
        nozel: string;
    }[];
    managers: User[];
    _id: any;
}
export declare const AdminSchema: mongoose.Schema<Admin, mongoose.Model<Admin, any, any, any, mongoose.Document<unknown, any, Admin> & Admin & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Admin, mongoose.Document<unknown, {}, mongoose.FlatRecord<Admin>> & mongoose.FlatRecord<Admin> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
