import { Body, Controller, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { SelectPlanDto } from "../plan/plan.dto";
import { AuthenticatedRequest } from "../auth/auth.request";
import { GetUser } from "../auth/get-user.decoration";
import {
  AddCreditDto,
  CreateStaffDto,
  CreditSalaryDto,
} from "../auth/create-user.dto";
import { Transaction } from "./admin.schema";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post("add-staff")
  async addStaff(
    @GetUser("pumpId") pumpId: string,
    @Body() dto: CreateStaffDto,
  ) {
    const staff = await this.adminService.addStaff(pumpId, dto);
    return staff;
  }

  // Get staff list
  @Get("staff")
  async getStaff(@GetUser("pumpId") pumpId: string) {
    const staff = await this.adminService.getStaff(pumpId);
    return staff;
  }

  // Update staff details
  @Patch("staff/:staffId")
  async updateStaff(
    @GetUser("pumpId") pumpId: string,
    @Param("staffId") staffId: string,
    @Body() update: Partial<CreateStaffDto>,
  ) {
    const staff = await this.adminService.updateStaff(pumpId, staffId, update);
    return staff;
  }

  @Post("staff/:staffId/credit-salary")
  async creditSalary(
    @Param("staffId") staffId: string,
    @Body() dto: CreditSalaryDto,
    @GetUser("pumpId") pumpId: string,
  ) {
    return this.adminService.creditSalary(pumpId, staffId, dto);
  }

  @Post("staff/:staffId/add-credit")
  async addCredit(
    @Param("staffId") staffId: string,
    @Body() dto: AddCreditDto,
    @GetUser("pumpId") pumpId: string,
  ) {
    return this.adminService.addCredit(pumpId, staffId, dto);
  }

  @Get("staff/:staffId/transactions")
  async getTransactions(
    @Param("staffId") staffId: string,
    @GetUser("pumpId") pumpId: string,
  ): Promise<Transaction[]> {
    return this.adminService.getTransactions(pumpId, staffId);
  }

  @Patch("plan")
  async updatePlan(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SelectPlanDto,
  ) {
    const adminId = req.user.sub;
    return this.adminService.selectPlan(adminId, dto);
  }

  @Get("profile")
  async getProfile(@Req() req: AuthenticatedRequest) {
    return this.adminService.getProfile(req.user);
  }

  @Get("machine-details")
  async getMachineDetails(@Req() req: AuthenticatedRequest) {
    const adminId = req.user.sub;
    return this.adminService.getMachineDetails(adminId);
  }
}
