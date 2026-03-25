import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ShiftStatusService } from "./shift-status.service";
import { CreateShiftStatusDto } from "./shift-status.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";
import { AuthUser } from "../admin/admin.enum";

@Controller("shift-status")
export class ShiftStatusController {
  constructor(private readonly service: ShiftStatusService) {}

  @Post()
  create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateShiftStatusDto,
  ) {
    return this.service.create(adminId, dto);
  }

  @Get()
  getByDate(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Query("date") date: string,
  ) {
    return this.service.getByDate(adminId, date);
  }

  @Patch(":id")
  update(
    @GetUser() user: AuthUser,
    @Param("id") id: string,
    @Body() dto: Partial<CreateShiftStatusDto>,
  ) {
    return this.service.update(user, id, dto);
  }
}
