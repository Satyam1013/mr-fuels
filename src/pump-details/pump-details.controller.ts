import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { PumpDetailsService } from "./pump-details.service";
import { CreatePumpDetailsDto, UpdatePumpDetailsDto } from "./pump-details.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("pump-details")
export class PumpDetailsController {
  constructor(private readonly pumpDetailsService: PumpDetailsService) {}

  @Post()
  async addPumpDetails(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePumpDetailsDto,
  ) {
    return this.pumpDetailsService.addPumpDetails(req.user.adminId, dto);
  }

  @Get()
  async getPumpDetails(@Req() req: AuthenticatedRequest) {
    return this.pumpDetailsService.getPumpDetails(req.user.adminId);
  }

  @Patch()
  async updatePumpDetails(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePumpDetailsDto,
  ) {
    return this.pumpDetailsService.updatePumpDetails(req.user.adminId, dto);
  }

  @Delete()
  async deletePumpDetails(@Req() req: AuthenticatedRequest) {
    return this.pumpDetailsService.deletePumpDetails(req.user.adminId);
  }
}
