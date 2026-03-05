import { Controller, Post, Body, Get, Req } from "@nestjs/common";
import { CreditorService } from "./creditors.service";
import { CreateCreditorDto } from "./creditors.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("creditors")
export class CreditorController {
  constructor(private readonly service: CreditorService) {}

  @Post()
  async create(
    @Body() dto: CreateCreditorDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.create(req.user.adminId, dto);
  }

  @Get()
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.service.findAll(req.user.adminId);
  }
}
