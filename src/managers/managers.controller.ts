import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ManagerService } from "./managers.service";
import { CreateManagerDto } from "./managers.dto";
import { AuthGuard } from "@nestjs/passport";

interface AuthenticatedRequest extends Request {
  user: {
    adminId: string;
  };
}

@Controller("managers")
@UseGuards(AuthGuard("jwt"))
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  async addManager(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateManagerDto,
  ) {
    return this.managerService.addManager(req.user.adminId, dto);
  }
}
