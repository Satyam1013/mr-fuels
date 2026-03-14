import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { TransactionDetailsService } from "./transactions.service";
import { CreateTransactionDetailsDto } from "./transactions.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("transactions")
export class TransactionDetailsController {
  constructor(
    private readonly transactionDetailsService: TransactionDetailsService,
  ) {}

  @Post()
  async addTransactionDetails(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTransactionDetailsDto,
  ) {
    return this.transactionDetailsService.addTransactionDetails(
      req.user.adminId,
      dto,
    );
  }

  @Get()
  async getTransactionDetails(@Req() req: AuthenticatedRequest) {
    return this.transactionDetailsService.getTransactionDetails(
      req.user.adminId,
    );
  }

  @Patch()
  async updateTransactionDetails(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateTransactionDetailsDto,
  ) {
    return this.transactionDetailsService.updateTransactionDetails(
      req.user.adminId,
      dto,
    );
  }

  @Delete()
  async deleteTransactionDetails(@Req() req: AuthenticatedRequest) {
    return this.transactionDetailsService.deleteTransactionDetails(
      req.user.adminId,
    );
  }
}
