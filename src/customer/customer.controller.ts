import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { CreateCustomerDto, UpdateCustomerDto } from "./customer.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateCustomerDto,
  ) {
    return this.customerService.create(adminId, dto);
  }

  @Get()
  findAll(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.customerService.findAll(adminId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCustomerDto) {
    return this.customerService.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.customerService.remove(id);
  }
}
