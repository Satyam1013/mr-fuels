import { Body, Controller, Get, Post } from "@nestjs/common";
import { PrepaidService } from "./prepaid.service";
import { CreatePrepaidDto } from "./prepaid.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("prepaid")
export class PrepaidController {
  constructor(private readonly service: PrepaidService) {}

  @Post()
  create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreatePrepaidDto,
  ) {
    return this.service.create(adminId, dto);
  }

  @Get()
  findAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.service.findAll(adminId);
  }
}
