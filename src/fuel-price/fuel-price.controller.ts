import { Body, Controller, Get, Patch } from "@nestjs/common";
import { FuelPriceService } from "./fuel-price.service";
import { UpdateFuelPriceDto } from "./fuel-price.dto";

@Controller("fuel-price")
export class FuelPriceController {
  constructor(private readonly fuelPriceService: FuelPriceService) {}

  @Get()
  getPrice() {
    return this.fuelPriceService.getPrice();
  }

  @Patch()
  updatePrice(@Body() updates: UpdateFuelPriceDto) {
    return this.fuelPriceService.updatePrice(updates);
  }
}
