import { Controller, Post, Body } from "@nestjs/common";
import { ShiftMachineService } from "./shift-machine.service";
import { CreateShiftMachineDto } from "./shift-machine.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("shift-machine")
export class ShiftMachineController {
  constructor(private readonly service: ShiftMachineService) {}

  @Post()
  async create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateShiftMachineDto,
  ) {
    return this.service.create(adminId, dto);
  }
}
