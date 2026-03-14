import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { CreateCustomerDto, UpdateCustomerDto } from "./customer.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("customers")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateCustomerDto) {
    return this.customerService.create(req.user.adminId, dto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.customerService.findAll(req.user.adminId);
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
