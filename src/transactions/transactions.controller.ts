import { Body, Controller, Post, Req } from "@nestjs/common";
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
}
