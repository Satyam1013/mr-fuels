import { Controller, Post, Body, Req } from "@nestjs/common";
import { ShiftMachineService } from "./shift-machine.service";
import { AuthenticatedRequest } from "../auth/auth.request";
import { CreateShiftMachineDto } from "./shift-machine.dto";

@Controller("shift-machine")
export class ShiftMachineController {
  constructor(private readonly service: ShiftMachineService) {}

  @Post()
  async create(
    @Body() dto: CreateShiftMachineDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const adminId = req.user.adminId;
    return this.service.create(adminId, dto);
  }
}
