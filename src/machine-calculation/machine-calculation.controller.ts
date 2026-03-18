import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { MachineCalculationService } from "./machine-calculation.service";
import { CreateMachineCalculationDto } from "./machine-calculation.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("machine-calculation")
export class MachineCalculationController {
  constructor(
    private readonly machineCalculationService: MachineCalculationService,
  ) {}

  @Post()
  create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateMachineCalculationDto,
  ) {
    return this.machineCalculationService.create(adminId, dto);
  }

  @Get()
  getAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.machineCalculationService.getAll(adminId);
  }

  @Get("machine-details")
  getMachineDetails(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Query("machineId") machineId: string,
    @Query("date") date: string,
    @Query("nozzleNumber") nozzleNumber?: number,
    @Query("shiftNumber") shiftNumber?: number,
  ) {
    return this.machineCalculationService.getMachineDetails(
      adminId,
      machineId,
      date,
      nozzleNumber,
      shiftNumber,
    );
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.machineCalculationService.getById(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.machineCalculationService.remove(id);
  }
}
