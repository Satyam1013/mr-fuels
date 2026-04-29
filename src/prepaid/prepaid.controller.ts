import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { PrepaidService } from "./prepaid.service";
import { CreatePrepaidDto, UpdatePrepaidDto } from "./prepaid.dto";
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

  @Patch(":id")
  update(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
    @Body() dto: UpdatePrepaidDto,
  ) {
    return this.service.update(adminId, id, dto);
  }

  @Delete(":id")
  remove(@GetUser("adminId") adminId: Types.ObjectId, @Param("id") id: string) {
    return this.service.remove(adminId, id);
  }
}
