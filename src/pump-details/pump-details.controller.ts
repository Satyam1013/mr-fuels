import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { PumpDetailsService } from "./pump-details.service";
import { CreatePumpDetailsDto, UpdatePumpDetailsDto } from "./pump-details.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("pump-details")
export class PumpDetailsController {
  constructor(private readonly pumpDetailsService: PumpDetailsService) {}

  @Post()
  async addPumpDetails(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreatePumpDetailsDto,
  ) {
    return this.pumpDetailsService.addPumpDetails(adminId, dto);
  }

  @Get()
  async getPumpDetails(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.pumpDetailsService.getPumpDetails(adminId);
  }

  @Patch()
  async updatePumpDetails(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: UpdatePumpDetailsDto,
  ) {
    return this.pumpDetailsService.updatePumpDetails(adminId, dto);
  }

  @Delete()
  async deletePumpDetails(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.pumpDetailsService.deletePumpDetails(adminId);
  }
}
