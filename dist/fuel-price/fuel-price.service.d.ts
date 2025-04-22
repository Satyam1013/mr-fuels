import { Model } from "mongoose";
import { FuelPrice, FuelPriceDocument } from "./fuel-price.schema";
import { UpdateFuelPriceDto } from "./fuel-price.dto";
export declare class FuelPriceService {
    private fuelPriceModel;
    constructor(fuelPriceModel: Model<FuelPriceDocument>);
    getPrice(): Promise<import("mongoose").Document<unknown, {}, FuelPriceDocument> & FuelPrice & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updatePrice(updates: UpdateFuelPriceDto): Promise<import("mongoose").Document<unknown, {}, FuelPriceDocument> & FuelPrice & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
