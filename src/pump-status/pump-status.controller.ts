// pump-status.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
} from "@nestjs/common";
import { PumpStatusService } from "./pump-status.service";
import { CreatePumpStatusDto } from "./pump-status.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("pump-status")
export class PumpStatusController {
  constructor(private readonly service: PumpStatusService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreatePumpStatusDto) {
    return this.service.create(req.user.adminId, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.service.findAll(req.user.adminId);
  }

  @Patch(":id/:status")
  updateStatus(@Param("id") id: string, @Param("status") status: string) {
    return this.service.updateStatus(id, status);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
