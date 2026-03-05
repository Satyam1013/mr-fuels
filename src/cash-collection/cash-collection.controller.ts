import { Body, Controller, Post, Req } from "@nestjs/common";
import { CashCollectionService } from "./cash-collection.service";
import { CreateCashCollectionDto } from "./cash-collection.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("cash-collection")
export class CashCollectionController {
  constructor(private readonly service: CashCollectionService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateCashCollectionDto,
  ) {
    return this.service.create(req.user.adminId, dto);
  }
}
