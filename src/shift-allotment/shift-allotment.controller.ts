import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { Types } from "mongoose";
import { GetUser } from "../auth/get-user.decoration";
import { ShiftAllotmentService } from "./shift-allotment.service";
import {
  CreateShiftAllotmentDto,
  UpdateShiftAllotmentDto,
} from "./shift-allotment.dto";

@Controller("shift-allotment")
export class ShiftAllotmentController {
  constructor(private readonly service: ShiftAllotmentService) {}

  @Post()
  create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateShiftAllotmentDto,
  ) {
    return this.service.create(adminId, dto);
  }

  @Get()
  findAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.service.findAll(adminId);
  }

  @Get(":id")
  findOne(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
  ) {
    return this.service.findOne(adminId, id);
  }

  @Patch(":id")
  update(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
    @Body() dto: UpdateShiftAllotmentDto,
  ) {
    return this.service.update(adminId, id, dto);
  }

  @Delete(":id")
  remove(@GetUser("adminId") adminId: Types.ObjectId, @Param("id") id: string) {
    return this.service.remove(adminId, id);
  }
}
