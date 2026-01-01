import { Body, Controller, Post, Req } from "@nestjs/common";
import { PumpDetailsService } from "./pump-details.service";
import { CreatePumpDetailsDto } from "./pump-details.dto";
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
}
