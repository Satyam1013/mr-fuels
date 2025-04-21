import { Controller, Get, Query } from "@nestjs/common";
import { PumpDataService } from "./pump-data.service";
import { PumpDataType } from "./pump-data.dto";

@Controller("pump-data")
export class PumpDataController {
  constructor(private readonly pumpDataService: PumpDataService) {}

  @Get()
  getPumpData(@Query("date") date: string, @Query("type") type: PumpDataType) {
    return this.pumpDataService.getPumpData(date, type);
  }
}
