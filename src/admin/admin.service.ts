/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Admin, AdminDocument } from "./admin.schema";
import { Model, Types } from "mongoose";
import { SelectPlanDto } from "../plan/plan.dto";
import { Plan, PlanDocument } from "../plan/plan.schema";
import {
  AddCreditDto,
  CreateStaffDto,
  CreditSalaryDto,
  SalaryMode,
} from "../auth/create-user.dto";
import type { Staff, Transaction } from "./admin.schema";

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Plan.name) private planModel: Model<PlanDocument>,
  ) {}

  async addStaff(pumpId: string, dto: CreateStaffDto) {
    const admin = await this.adminModel.findById(pumpId);
    if (!admin) throw new NotFoundException("Admin not found");

    const staffId = new Types.ObjectId();

    admin.staff.push({
      _id: staffId,
      ...dto,
      dateJoined: new Date(dto.dateJoined),
    } as any);

    await admin.save();

    return {
      success: true,
      staffId,
      message: "Staff added successfully",
    };
  }

  async getStaff(pumpId: string) {
    const admin = await this.adminModel.findById(pumpId).select("staff");
    if (!admin) throw new NotFoundException("Admin not found");
    return admin.staff;
  }

  async updateStaff(
    pumpId: string,
    staffId: string,
    update: Partial<CreateStaffDto>,
  ) {
    const admin = await this.adminModel.findById(pumpId);
    if (!admin) throw new NotFoundException("Admin not found");

    const staff = admin.staff.id(staffId);
    if (!staff) throw new NotFoundException("Staff not found");

    Object.assign(staff, update);
    await admin.save();

    return { success: true, message: "Staff updated successfully" };
  }

  async selectPlan(adminId: string, dto: SelectPlanDto) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) throw new NotFoundException("Admin not found");

    const selectedPlan = await this.planModel.findById(dto.planId);
    if (!selectedPlan) throw new BadRequestException("Invalid plan selected");

    admin.plan = selectedPlan._id as Types.ObjectId;

    const now = new Date();
    let expiresAt: Date;

    // Set expiry based on plan type
    switch (selectedPlan.type) {
      case "free":
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
        admin.freeTrial = true;
        admin.paidUser = false;
        break;

      case "monthly":
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        admin.freeTrial = false;
        admin.paidUser = true;
        break;

      case "quarterly":
        expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
        admin.freeTrial = false;
        admin.paidUser = true;
        break;

      case "yearly":
        expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days
        admin.freeTrial = false;
        admin.paidUser = true;
        break;

      default:
        throw new BadRequestException("Unknown plan type");
    }

    admin.planExpiresAt = expiresAt;
    admin.activeAccount = true;
    await admin.save();

    return {
      message: `Plan updated to ${selectedPlan.label}`,
      expiresAt,
    };
  }

  async getProfile(user: {
    role: string;
    mobileNo: string;
    adminId?: string;
    sub: string;
  }) {
    if (user.role === "admin") {
      const adminDoc = await this.adminModel
        .findOne({ mobileNo: user.mobileNo })
        .populate("plan");

      if (!adminDoc) throw new NotFoundException("Admin not found");

      const admin = adminDoc as AdminDocument & { plan: Plan };

      return {
        role: "admin",
        data: {
          businessEmail: admin.businessEmail,
          businessName: admin.businessName,
          mobileNo: admin.mobileNo,
          startDate: admin.startDate,
          freeTrial: admin.freeTrial,
          freeTrialAttempt: admin.freeTrialAttempt,
          paidUser: admin.paidUser,
          activeAccount: admin.activeAccount,
          plan: {
            label: admin.plan?.label,
            type: admin.plan?.type,
            price: admin.plan?.price,
            period: admin.plan?.period,
          },
        },
      };
    }

    if (user.role === "manager" && user.adminId) {
      const adminDoc = await this.adminModel
        .findById(user.adminId)
        .populate("plan");

      if (!adminDoc) throw new NotFoundException("Admin (owner) not found");

      const admin = adminDoc as AdminDocument & { plan: Plan };

      const manager = admin.managers.find((m) => m.mobile === user.mobileNo);
      if (!manager) throw new NotFoundException("Manager not found");

      return {
        role: "manager",
        data: {
          manager: {
            name: manager.name,
            mobile: manager.mobile,
            shift: manager.shift,
          },
          admin: {
            businessEmail: admin.businessEmail,
            businessName: admin.businessName,
            freeTrial: admin.freeTrial,
            paidUser: admin.paidUser,
            activeAccount: admin.activeAccount,
            plan: {
              label: admin.plan?.label,
              type: admin.plan?.type,
              price: admin.plan?.price,
              period: admin.plan?.period,
            },
          },
        },
      };
    }

    throw new BadRequestException("Invalid role or user context");
  }

  async getMachineDetails(adminId: string | undefined) {
    const admin = await this.adminModel
      .findById(adminId)
      .select("machines fuelTypes");

    if (!admin) {
      throw new Error("Admin not found");
    }

    return {
      fuelTypes: admin.fuelTypes,
      machines: admin.machines,
    };
  }

  async creditSalary(pumpId: string, staffId: string, dto: CreditSalaryDto) {
    const admin = await this.adminModel.findById(pumpId);
    if (!admin) throw new NotFoundException("Admin not found");

    const staff = admin.staff.id(staffId) as Staff | undefined;
    if (!staff) throw new NotFoundException("Staff not found");

    let creditedAmount = 0;
    switch (dto.mode) {
      case SalaryMode.FULL:
        creditedAmount = staff.salary;
        break;
      case SalaryMode.MINUS_CREDIT:
        creditedAmount = staff.salary - staff.credit;
        break;
      case SalaryMode.CUSTOM:
        creditedAmount = dto.amount;
        break;
      default:
        throw new BadRequestException("Invalid salary mode");
    }

    // Update staff salary state
    staff.salaryPending = false;
    staff.creditLeft = 0;

    // Add transaction record
    staff.transactions.push({
      type: "salary",
      date: new Date().toISOString(),
      amount: creditedAmount,
      description: `Salary credited via ${dto.mode}`,
      details: { pendingIds: dto.pendingIds },
    });

    await admin.save();
    return { success: true };
  }

  async addCredit(pumpId: string, staffId: string, dto: AddCreditDto) {
    const admin = await this.adminModel.findById(pumpId);
    if (!admin) throw new NotFoundException("Pump not found");

    const staff = admin.staff.id(staffId) as Staff | null;
    if (!staff) throw new NotFoundException("Staff not found");

    staff.credit = (staff.credit || 0) + dto.amount;

    staff.transactions.push({
      type: "credit",
      date: new Date().toISOString(),
      amount: dto.amount,
      description: "Manual credit added",
    });

    await admin.save();
    return { success: true };
  }

  async getTransactions(
    pumpId: string,
    staffId: string,
  ): Promise<Transaction[]> {
    const admin = await this.adminModel
      .findById(pumpId)
      .lean<Admin & { staff: (Staff & { transactions: Transaction[] })[] }>();
    if (!admin) throw new NotFoundException("Pump not found");

    const staff = admin.staff.find((s) => s._id.toString() === staffId);
    if (!staff) throw new NotFoundException("Staff not found");

    return staff.transactions ?? [];
  }
}
