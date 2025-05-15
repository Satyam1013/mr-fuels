import { Document } from "mongoose";
export type UserDocument = User & Document;
export declare enum UserRole {
    MANAGER = "MANAGER",
    STAFF = "STAFF"
}
export declare class User {
    username: string;
    password: string;
    mobile: string;
    role: UserRole;
    aadharImage: string;
    shift: number;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
