import { FuelPriceService } from "./fuel-price.service";
import { UpdateFuelPriceDto } from "./fuel-price.dto";
export declare class FuelPriceController {
    private readonly fuelPriceService;
    constructor(fuelPriceService: FuelPriceService);
    getPrice(): Promise<import("mongoose").Document<unknown, {}, import("./fuel-price.schema").FuelPriceDocument> & import("./fuel-price.schema").FuelPrice & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updatePrice(updates: UpdateFuelPriceDto): Promise<import("mongoose").Document<unknown, {}, import("./fuel-price.schema").FuelPriceDocument> & import("./fuel-price.schema").FuelPrice & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
}
