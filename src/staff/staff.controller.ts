import { Body, Controller, Post, Req } from "@nestjs/common";
import { StaffService } from "./staff.service";
import { CreateStaffDto } from "./staff.dto";

interface AuthenticatedRequest extends Request {
  user: {
    adminId: string;
  };
}

@Controller("staff")
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async addStaff(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateStaffDto,
  ) {
    return this.staffService.addStaff(req.user.adminId, dto);
  }
}
