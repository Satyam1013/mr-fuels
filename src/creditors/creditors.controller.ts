import { Controller, Post, Body, Get } from "@nestjs/common";
import { CreditorService } from "./creditors.service";
import { CreateCreditorDto } from "./creditors.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("creditors")
export class CreditorController {
  constructor(private readonly service: CreditorService) {}

  @Post()
  async create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateCreditorDto,
  ) {
    return this.service.create(adminId, dto);
  }

  @Get()
  async findAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.service.findAll(adminId);
  }
}
