import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { DigitalPaymentService } from "./digital-payment.service";
import {
  CreateDigitalPaymentDto,
  UpdateDigitalPaymentDto,
} from "./digital-payment.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("digital-payments")
export class DigitalPaymentController {
  constructor(private readonly digitalService: DigitalPaymentService) {}

  @Post()
  async create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateDigitalPaymentDto,
  ) {
    return this.digitalService.create(adminId, dto);
  }

  @Get()
  async findAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.digitalService.findAll(adminId);
  }

  @Get("shift")
  async findByShift(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Query("date") date: string,
    @Query("shiftId") shiftId: number,
  ) {
    return this.digitalService.findByShift(adminId, date, Number(shiftId));
  }

  @Patch(":id")
  async update(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
    @Body() dto: UpdateDigitalPaymentDto,
  ) {
    return this.digitalService.update(adminId, id, dto);
  }
}
