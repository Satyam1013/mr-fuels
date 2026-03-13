import { Body, Controller, Delete, Param, Post, Req } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { BulkCreateStaffDto } from "./staff.dto";
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

  @Delete(":id")
  async removeStaff(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.staffService.removeStaff(req.user.adminId, id);
  }
}
