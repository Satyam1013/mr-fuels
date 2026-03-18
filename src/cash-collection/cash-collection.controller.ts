import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CashCollectionService } from "./cash-collection.service";
import {
  CreateCashCollectionDto,
  UpdateCashCollectionDto,
} from "./cash-collection.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("cash-collection")
export class CashCollectionController {
  constructor(private readonly service: CashCollectionService) {}

  @Post()
  create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateCashCollectionDto,
  ) {
    return this.service.create(adminId, dto);
  }

  @Get()
  findAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.service.findAll(adminId);
  }

  @Get(":id")
  findOne(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
  ) {
    return this.service.findOne(adminId, id);
  }

  @Patch(":id")
  update(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
    @Body() dto: UpdateCashCollectionDto,
  ) {
    return this.service.update(adminId, id, dto);
  }

  @Delete(":id")
  remove(@GetUser("adminId") adminId: Types.ObjectId, @Param("id") id: string) {
    return this.service.remove(adminId, id);
  }
}
