// pump-status.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
} from "@nestjs/common";
import { PumpStatusService } from "./pump-status.service";
import { CreatePumpStatusDto, UpdatePumpStatusDto } from "./pump-status.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("pump-status")
export class PumpStatusController {
  constructor(private readonly service: PumpStatusService) {}

  @Post()
  create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreatePumpStatusDto,
  ) {
    return this.service.create(adminId, dto);
  }

  @Get()
  findAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.service.findAll(adminId);
  }

  @Patch(":id")
  updateStatus(@Param("id") id: string, @Body() dto: UpdatePumpStatusDto) {
    return this.service.updateStatus(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.service.delete(id);
  }
}
