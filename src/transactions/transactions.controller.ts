import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { TransactionDetailsService } from "./transactions.service";
import { CreateTransactionDetailsDto } from "./transactions.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("transactions")
export class TransactionDetailsController {
  constructor(
    private readonly transactionDetailsService: TransactionDetailsService,
  ) {}

  @Post()
  async addTransactionDetails(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateTransactionDetailsDto,
  ) {
    return this.transactionDetailsService.addTransactionDetails(adminId, dto);
  }

  @Get()
  async getTransactionDetails(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.transactionDetailsService.getTransactionDetails(adminId);
  }

  @Patch()
  async updateTransactionDetails(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateTransactionDetailsDto,
  ) {
    return this.transactionDetailsService.updateTransactionDetails(
      adminId,
      dto,
    );
  }

  @Delete()
  async deleteTransactionDetails(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.transactionDetailsService.deleteTransactionDetails(adminId);
  }
}
