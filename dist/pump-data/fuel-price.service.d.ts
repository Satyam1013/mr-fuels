import { Model } from "mongoose";
import { FuelPrice, FuelPriceDocument } from "./fuel-price.schema";
export declare class FuelPriceService {
    private fuelPriceModel;
    constructor(fuelPriceModel: Model<FuelPriceDocument>);
    getPrice(): Promise<import("mongoose").Document<unknown, {}, FuelPriceDocument> & FuelPrice & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updatePrice(updates: Partial<FuelPrice>): Promise<import("mongoose").Document<unknown, {}, FuelPriceDocument> & FuelPrice & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
