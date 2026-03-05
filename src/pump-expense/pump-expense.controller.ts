import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Req,
} from "@nestjs/common";
import { PumpExpenseService } from "./pump-expense.service";
import { CreatePumpExpenseDto } from "./pump-expense.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("pump-expense")
export class PumpExpenseController {
  constructor(private readonly pumpExpenseService: PumpExpenseService) {}

  @Post()
  create(@Body() dto: CreatePumpExpenseDto, @Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
    return this.pumpExpenseService.create(adminId, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
    return this.pumpExpenseService.findAll(adminId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.pumpExpenseService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.pumpExpenseService.remove(id);
  }
}
