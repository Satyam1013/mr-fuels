import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Patch,
} from "@nestjs/common";
import { PersonalExpenseService } from "./personal-expense.service";
import {
  CreatePersonalExpenseDto,
  UpdatePersonalExpenseDto,
} from "./personal-expense.dto";
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
  findOne(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
  ) {
    return this.personalExpenseService.findOne(adminId, id);
  }

  @Patch(":id")
  update(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
    @Body() dto: UpdatePersonalExpenseDto,
  ) {
    return this.personalExpenseService.patch(adminId, id, dto);
  }

  @Delete(":id")
  remove(@GetUser("adminId") adminId: Types.ObjectId, @Param("id") id: string) {
    return this.personalExpenseService.remove(adminId, id);
  }
}
