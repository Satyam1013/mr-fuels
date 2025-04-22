import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { FuelPrice, FuelPriceDocument } from "./fuel-price.schema";
import { UpdateFuelPriceDto } from "./fuel-price.dto";

@Injectable()
export class FuelPriceService {
  constructor(
    @InjectModel(FuelPrice.name)
    private fuelPriceModel: Model<FuelPriceDocument>,
  ) {}

  async getPrice() {
    const existing = await this.fuelPriceModel.findOne();
    if (!existing) throw new NotFoundException("Fuel prices not found");
    return existing;
  }

  async updatePrice(updates: UpdateFuelPriceDto) {
    try {
      const fuelPrice = await this.fuelPriceModel.findOne();
      if (!fuelPrice) {
        // If no price exists, create one
        const newPrice = new this.fuelPriceModel(updates);
        return await newPrice.save();
      }

      Object.assign(fuelPrice, updates);
      return await fuelPrice.save();
    } catch (error) {
      console.error("Update Price Error:", error);
      throw new InternalServerErrorException("Failed to update fuel prices");
    }
  }
}
