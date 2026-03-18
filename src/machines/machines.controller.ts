import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
} from "@nestjs/common";
import { MachineService } from "./machines.service";
import { BulkCreateMachineDto, CreateMachineDto } from "./machines.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("machines")
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  async createMachines(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() body: BulkCreateMachineDto,
  ) {
    return this.machineService.createMachines(adminId, body.machines);
  }

  @Get()
  async getMachines(@GetUser("adminId") adminId: Types.ObjectId) {
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
