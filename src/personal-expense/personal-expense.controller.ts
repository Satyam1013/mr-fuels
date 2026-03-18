import { Body, Controller, Get, Post, Param, Delete } from "@nestjs/common";
import { PersonalExpenseService } from "./personal-expense.service";
import { CreatePersonalExpenseDto } from "./personal-expense.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("personal-expense")
export class PersonalExpenseController {
  constructor(
    private readonly personalExpenseService: PersonalExpenseService,
  ) {}

  @Post()
  create(
    @Body() dto: CreatePersonalExpenseDto,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    return this.personalExpenseService.create(adminId, dto);
  }

  @Get()
  findAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.personalExpenseService.findAll(adminId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.personalExpenseService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.personalExpenseService.remove(id);
  }
}
