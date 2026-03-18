import { Body, Controller, Get, Post, Param, Delete } from "@nestjs/common";
import { PumpExpenseService } from "./pump-expense.service";
import { CreatePumpExpenseDto } from "./pump-expense.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("pump-expense")
export class PumpExpenseController {
  constructor(private readonly pumpExpenseService: PumpExpenseService) {}

  @Post()
  create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreatePumpExpenseDto,
  ) {
    return this.pumpExpenseService.create(adminId, dto);
  }

  @Get()
  findAll(@GetUser("adminId") adminId: Types.ObjectId) {
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
