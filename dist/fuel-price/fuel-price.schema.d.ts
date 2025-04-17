import { Document } from "mongoose";
export type FuelPriceDocument = FuelPrice & Document;
export declare class FuelPrice {
    petrol: number;
    diesel: number;
    power: number;
}
export declare const FuelPriceSchema: import("mongoose").Schema<FuelPrice, import("mongoose").Model<FuelPrice, any, any, any, Document<unknown, any, FuelPrice> & FuelPrice & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FuelPrice, Document<unknown, {}, import("mongoose").FlatRecord<FuelPrice>> & import("mongoose").FlatRecord<FuelPrice> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
