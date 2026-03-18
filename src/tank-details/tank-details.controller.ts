import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { TankService } from "./tank-details.service";
import { CreateTankDetailsDto, UpdateTankDetailsDto } from "./tank-details.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("tanks")
export class TankController {
  constructor(private readonly tankService: TankService) {}

  @Post()
  create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateTankDetailsDto,
  ) {
    return this.tankService.create(adminId, dto);
  }

  @Get()
  findAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.tankService.findAll(adminId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tankService.findOne(id);
  }

  @Patch()
  updateMany(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: UpdateTankDetailsDto,
  ) {
    return this.tankService.updateMany(adminId, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tankService.remove(id);
  }
}
