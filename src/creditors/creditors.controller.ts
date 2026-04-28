import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CreditorService } from "./creditors.service";
import { CreateCreditorDto, UpdateCreditorDto } from "./creditors.dto";
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

  @Patch(":id")
  async update(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
    @Body() dto: UpdateCreditorDto,
  ) {
    return this.service.update(adminId, id, dto);
  }

  @Delete(":id")
  async remove(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
  ) {
    return this.service.remove(adminId, id);
  }
}
