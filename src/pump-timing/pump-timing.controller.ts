import { Controller, Post, Get, Body, Req } from "@nestjs/common";
import { PumpTimingService } from "./pump-timing.service";
import { UpdatePumpTimingDto } from "./pump-timing.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("pump-timing")
export class PumpTimingController {
  constructor(private readonly timingService: PumpTimingService) {}

  @Post()
  async saveTiming(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePumpTimingDto,
  ) {
    return this.timingService.updateTiming(req.user.adminId, dto);
  }

  @Get()
  async getTiming(@Req() req: AuthenticatedRequest) {
    return this.timingService.getTiming(req.user.adminId);
  }
}
