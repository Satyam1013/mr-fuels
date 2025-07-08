import { Document, Types } from "mongoose";
export declare class SuperAdmin {
    _id: Types.ObjectId;
    name: string;
    email: string;
    mobile: string;
    password: string;
}
export type SuperAdminDocument = SuperAdmin & Document;
export declare const SuperAdminSchema: import("mongoose").Schema<SuperAdmin, import("mongoose").Model<SuperAdmin, any, any, any, Document<unknown, any, SuperAdmin> & SuperAdmin & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SuperAdmin, Document<unknown, {}, import("mongoose").FlatRecord<SuperAdmin>> & import("mongoose").FlatRecord<SuperAdmin> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
