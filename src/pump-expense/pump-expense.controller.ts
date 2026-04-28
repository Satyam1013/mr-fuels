import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import { PumpExpenseService } from "./pump-expense.service";
import { CreatePumpExpenseDto, UpdatePumpExpenseDto } from "./pump-expense.dto";
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
  findOne(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
  ) {
    return this.pumpExpenseService.findOne(adminId, id);
  }

  @Patch(":id")
  update(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
    @Body() dto: UpdatePumpExpenseDto,
  ) {
    return this.pumpExpenseService.update(adminId, id, dto);
  }

  @Delete(":id")
  remove(@GetUser("adminId") adminId: Types.ObjectId, @Param("id") id: string) {
    return this.pumpExpenseService.remove(adminId, id);
  }
}
