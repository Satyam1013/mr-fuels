import { Model } from "mongoose";
import { UserDocument } from "./user.schema";
export declare class UserService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
}
