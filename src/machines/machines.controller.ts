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

  // Create machine
  @Post()
  async createMachine(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateMachineDto,
  ) {
    const adminId = req.user.adminId;
    return this.machineService.createMachine(adminId, dto);
  }

  // Get all machines of admin
  @Get()
  async getMachines(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
    return this.machineService.getMachines(adminId);
  }

  // Get single machine
  @Get(":id")
  async getMachineById(@Param("id") id: string) {
    return this.machineService.getMachineById(id);
  }

  // Update machine
  @Patch(":id")
  async updateMachine(
    @Param("id") id: string,
    @Body() dto: Partial<CreateMachineDto>,
  ) {
    return this.machineService.updateMachine(id, dto);
  }

  // Delete machine
  @Delete(":id")
  async deleteMachine(@Param("id") id: string) {
    return this.machineService.deleteMachine(id);
  }
}
