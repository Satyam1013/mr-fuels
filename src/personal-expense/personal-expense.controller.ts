import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Req,
} from "@nestjs/common";
import { PersonalExpenseService } from "./personal-expense.service";
import { CreatePersonalExpenseDto } from "./personal-expense.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("personal-expense")
export class PersonalExpenseController {
  constructor(
    private readonly personalExpenseService: PersonalExpenseService,
  ) {}

  @Post()
  create(
    @Body() dto: CreatePersonalExpenseDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const adminId = req.user.adminId;
    return this.personalExpenseService.create(adminId, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.adminId;
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
