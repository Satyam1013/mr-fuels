// src/pump-expense/pump-expense.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { PumpExpenseService } from "./pump-expenses.service";
import {
  CreatePumpExpenseDto,
  UpdatePumpExpenseDto,
} from "./pump-expenses.dto";

@Controller("pump-expense")
export class PumpExpenseController {
  constructor(private readonly pumpExpenseService: PumpExpenseService) {}

  @Post()
  create(@Body() dto: CreatePumpExpenseDto) {
    return this.pumpExpenseService.create(dto);
  }

  @Get()
  findAll() {
    return this.pumpExpenseService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.pumpExpenseService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePumpExpenseDto) {
    return this.pumpExpenseService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.pumpExpenseService.delete(id);
  }
}
