import { Document } from "mongoose";
export type AdminDocument = Admin & Document;
export declare class Admin {
    email: string;
    password: string;
    _id: any;
}
export declare const AdminSchema: import("mongoose").Schema<Admin, import("mongoose").Model<Admin, any, any, any, Document<unknown, any, Admin> & Admin & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Admin, Document<unknown, {}, import("mongoose").FlatRecord<Admin>> & import("mongoose").FlatRecord<Admin> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
