import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { StaffService } from "./staff.service";
import { BulkCreateStaffDto, UpdateStaffDto } from "./staff.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async addStaff(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: BulkCreateStaffDto,
  ) {
    return this.staffService.addStaff(adminId, dto);
  }

  @Get()
  async getStaff(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.staffService.getStaff(adminId);
  }

  @Patch(":id")
  async updateStaff(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.staffService.updateStaff(adminId, id, dto);
  }

  @Delete(":id")
  async removeStaff(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Param("id") id: string,
  ) {
    return this.staffService.removeStaff(adminId, id);
  }
}
