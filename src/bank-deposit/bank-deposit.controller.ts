import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { Types } from "mongoose";
import { BankDepositService } from "./bank-deposit.service";
import { CreateBankDepositDto } from "./bank-deposit.dto";
import { UpdateBankDepositDto } from "./bank-deposit.dto";
import { GetUser } from "../auth/get-user.decoration";

@Controller("bank-deposit")
export class BankDepositController {
  constructor(private readonly bankDepositService: BankDepositService) {}

  // POST /bank-deposit
  @Post()
  async create(
    @Body() dto: CreateBankDepositDto,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    return this.bankDepositService.create(adminId, dto);
  }

  // GET /bank-deposit?date=2026-04-17&shiftNumber=1
  @Get()
  async findAll(
    @Query("date") date: string,
    @Query("shiftNumber") shiftNumber: string,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    return this.bankDepositService.findAll(adminId, date, Number(shiftNumber));
  }

  // PATCH /bank-deposit/:id
  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateBankDepositDto,
    @GetUser("adminId") adminId: Types.ObjectId,
  ) {
    return this.bankDepositService.update(adminId, id, dto);
  }
}
