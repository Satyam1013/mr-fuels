import { Body, Controller, Get, Post, Query, Req } from "@nestjs/common";
import { DigitalPaymentService } from "./digital-payment.service";
import { CreateDigitalPaymentDto } from "./digital-payment.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("digital-payments")
export class DigitalPaymentController {
  constructor(private readonly digitalService: DigitalPaymentService) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateDigitalPaymentDto,
  ) {
    return this.digitalService.create(req.user.adminId, dto);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.digitalService.findAll(req.user.adminId);
  }

  @Get("shift")
  async findByShift(
    @Req() req: AuthenticatedRequest,
    @Query("date") date: string,
    @Query("shiftId") shiftId: number,
  ) {
    return this.digitalService.findByShift(
      req.user.adminId,
      date,
      Number(shiftId),
    );
  }
}
