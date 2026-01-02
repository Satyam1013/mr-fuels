import { Body, Controller, Post, Req } from "@nestjs/common";
import { ManagerService } from "./managers.service";
import { CreateManagerDto } from "./managers.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("managers")
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
