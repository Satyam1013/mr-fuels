import { Body, Controller, Delete, Get, Patch, Post } from "@nestjs/common";
import { DsrDetailsService } from "./dsr.service";
import { CreateDsrDetailsDto } from "./dsr.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("dsr-details")
export class DsrDetailsController {
  constructor(private readonly dsrService: DsrDetailsService) {}

  @Post()
  async addOrUpdate(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateDsrDetailsDto,
  ) {
    return this.dsrService.addOrUpdate(adminId, dto);
  }

  @Get()
  async getMyDsr(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.dsrService.getByAdmin(adminId);
  }

  @Patch()
  async updateDsr(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: CreateDsrDetailsDto,
  ) {
    return this.dsrService.updateDsr(adminId, dto);
  }

  @Delete()
  async deleteDsr(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.dsrService.deleteDsr(adminId);
  }
}
