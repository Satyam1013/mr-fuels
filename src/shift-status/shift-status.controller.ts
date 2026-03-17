import { Body, Controller, Get, Patch, Post, Query, Req } from "@nestjs/common";
import { ShiftStatusService } from "./shift-status.service";
import { CreateShiftStatusDto } from "./shift-status.dto";
import { AuthenticatedRequest } from "../auth/auth.request";
import { ShiftStatus } from "./shift-status.schema";

@Controller("shift-status")
export class ShiftStatusController {
  constructor(private readonly service: ShiftStatusService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateShiftStatusDto) {
    return this.service.create(req.user.adminId, dto);
  }

  @Get()
  getByDate(@Req() req: AuthenticatedRequest, @Query("date") date: string) {
    return this.service.getByDate(req.user.adminId, date);
  }

  @Patch(":id")
  update(@Body() dto: Partial<CreateShiftStatusDto>, @Query("id") id: string) {
    return this.service.update(id, dto);
  }

  @Patch("close-day")
  closeDay(
    @Req() req: AuthenticatedRequest,
    @Query("id") id: string,
  ): Promise<ShiftStatus | null> {
    return this.service.closeDay(req.user, id);
  }
}
