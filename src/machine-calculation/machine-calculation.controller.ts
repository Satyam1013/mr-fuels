import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { MachineCalculationService } from "./machine-calculation.service";
import { CreateMachineCalculationDto } from "./machine-calculation.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("machine-calculation")
export class MachineCalculationController {
  constructor(
    private readonly machineCalculationService: MachineCalculationService,
  ) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateMachineCalculationDto,
  ) {
    return this.machineCalculationService.create(req.user.adminId, dto);
  }

  @Get()
  getAll(@Req() req: AuthenticatedRequest) {
    return this.machineCalculationService.getAll(req.user.adminId);
  }

  @Get("machine-details")
  getMachineDetails(
    @Req() req: AuthenticatedRequest,
    @Query("machineId") machineId: string,
    @Query("date") date: string,
    @Query("nozzleNumber") nozzleNumber?: number,
    @Query("shiftNumber") shiftNumber?: number,
  ) {
    return this.machineCalculationService.getMachineDetails(
      req.user.adminId,
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
