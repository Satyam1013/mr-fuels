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
import { StaffService } from "./staff.service";
import { BulkCreateStaffDto, UpdateStaffDto } from "./staff.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async addStaff(
    @Req() req: AuthenticatedRequest,
    @Body() dto: BulkCreateStaffDto,
  ) {
    return this.staffService.addStaff(req.user.adminId, dto);
  }

  @Get()
  async getStaff(@Req() req: AuthenticatedRequest) {
    return this.staffService.getStaff(req.user.adminId);
  }

  @Patch(":id")
  async updateStaff(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.staffService.updateStaff(req.user.adminId, id, dto);
  }

  @Delete(":id")
  async removeStaff(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.staffService.removeStaff(req.user.adminId, id);
  }
}
