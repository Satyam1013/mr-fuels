import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ManagerService } from "./managers.service";
import { BulkCreateManagerDto, UpdateManagerDto } from "./managers.dto";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("manager")
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post()
  async addManagers(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() body: BulkCreateManagerDto,
  ) {
    return this.managerService.addManagers(adminId, body);
  }

  @Get()
  async getManagers(@GetUser("adminId") adminId: Types.ObjectId) {
    return this.managerService.getManagers(adminId);
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
