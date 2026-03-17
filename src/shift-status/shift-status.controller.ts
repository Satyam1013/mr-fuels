import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import { ShiftStatusService } from "./shift-status.service";
import { CreateShiftStatusDto } from "./shift-status.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

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
  update(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: Partial<CreateShiftStatusDto>,
  ) {
    return this.service.update(req.user, id, dto);
  }
}
