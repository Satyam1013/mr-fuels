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
import { ManagerService } from "./managers.service";
import { BulkCreateManagerDto, UpdateManagerDto } from "./managers.dto";
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

  @Get()
  async getManagers(@Req() req: AuthenticatedRequest) {
    return this.managerService.getManagers(req.user.adminId);
  }

  @Patch(":id")
  async updateManager(@Param("id") id: string, @Body() body: UpdateManagerDto) {
    return this.managerService.updateManager(id, body);
  }

  @Delete(":id")
  async deleteManager(@Param("id") id: string) {
    return this.managerService.deleteManager(id);
  }
}
