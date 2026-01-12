import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  Req,
} from "@nestjs/common";
import { MachineService } from "./machines.service";
import { CreateMachineDto } from "./machines.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("machines")
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  async createMachine(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateMachineDto,
  ) {
    const adminId = req.user.adminId;
    return this.machineService.createMachine(adminId, dto);
  }

  @Get()
  async getMachines(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
    return this.machineService.getMachines(adminId);
  }

  @Get(":id")
  async getMachineById(@Param("id") id: string) {
    return this.machineService.getMachineById(id);
  }

  @Patch(":id")
  async updateMachine(
    @Param("id") id: string,
    @Body() dto: Partial<CreateMachineDto>,
  ) {
    return this.machineService.updateMachine(id, dto);
  }

  @Delete(":id")
  async deleteMachine(@Param("id") id: string) {
    return this.machineService.deleteMachine(id);
  }
}
