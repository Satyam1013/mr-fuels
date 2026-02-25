import { Body, Controller, Post, Req } from "@nestjs/common";
import { ManagerService } from "./managers.service";
import { BulkCreateManagerDto } from "./managers.dto";
import { AuthenticatedRequest } from "../auth/auth.request";

@Controller("manager")
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  async addManagers(
    @Req() req: AuthenticatedRequest,
    @Body() body: BulkCreateManagerDto,
  ) {
    return this.managerService.addManagers(req.user.adminId, body);
  }
}
