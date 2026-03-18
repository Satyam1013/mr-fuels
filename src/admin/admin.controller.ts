import { Body, Controller, Patch } from "@nestjs/common";
import { SelectPlanDto } from "./admin.dto";
import { AdminService } from "./admin.service";
import { GetUser } from "../auth/get-user.decoration";
import { Types } from "mongoose";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Patch("select-plan")
  selectPlan(
    @GetUser("adminId") adminId: Types.ObjectId,
    @Body() dto: SelectPlanDto,
  ) {
    return this.adminService.selectPlan(adminId, dto.planId);
  }
}
