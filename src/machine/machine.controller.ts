import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { MachineService } from "./machine.service";
import {
  CreateMachineDto,
  UpdateMachineDto,
  UpdateReadingDto,
} from "./machine.dto";

@Controller("machines")
export class MachineController {
  constructor(private readonly machineService: MachineService) {}

  @Post()
  create(@Body() data: CreateMachineDto) {
    return this.machineService.createMachine(data);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updates: UpdateMachineDto) {
    return this.machineService.updateMachine(id, updates);
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.machineService.deleteMachine(id);
  }

  @Get()
  getAllMachines() {
    return this.machineService.getAllMachines();
  }

  @Patch(":id/reading")
  updateReading(@Param("id") id: string, @Body() data: UpdateReadingDto) {
    return this.machineService.updateReading(id, data.startDayReading);
  }
}
