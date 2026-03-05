import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { PrepaidService } from "./prepaid.service";
import { CreatePrepaidDto } from "./prepaid.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("prepaid")
export class PrepaidController {
  constructor(private readonly service: PrepaidService) {}

  @Post()
  create(@Body() dto: CreatePrepaidDto, @Req() req: AuthenticatedRequest) {
    return this.service.create(req.user.adminId, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.service.findAll(req.user.adminId);
  }
}
