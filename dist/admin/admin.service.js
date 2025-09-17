"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
/* eslint-disable @typescript-eslint/no-unsafe-argument */
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_schema_1 = require("./admin.schema");
const mongoose_2 = require("mongoose");
const plan_schema_1 = require("../plan/plan.schema");
const create_user_dto_1 = require("../auth/create-user.dto");
let AdminService = class AdminService {
    constructor(adminModel, planModel) {
        this.adminModel = adminModel;
        this.planModel = planModel;
    }
    async addStaff(pumpId, dto) {
        const admin = await this.adminModel.findById(pumpId);
        if (!admin)
            throw new common_1.NotFoundException("Admin not found");
        const staffId = new mongoose_2.Types.ObjectId();
        admin.staff.push({
            _id: staffId,
            ...dto,
            dateJoined: new Date(dto.dateJoined),
        });
        await admin.save();
        return {
            success: true,
            staffId,
            message: "Staff added successfully",
        };
    }
    async getStaff(pumpId) {
        const admin = await this.adminModel.findById(pumpId).select("staff");
        if (!admin)
            throw new common_1.NotFoundException("Admin not found");
        return admin.staff;
    }
    async updateStaff(pumpId, staffId, update) {
        const admin = await this.adminModel.findById(pumpId);
        if (!admin)
            throw new common_1.NotFoundException("Admin not found");
        const staff = admin.staff.id(staffId);
        if (!staff)
            throw new common_1.NotFoundException("Staff not found");
        Object.assign(staff, update);
        await admin.save();
        return { success: true, message: "Staff updated successfully" };
    }
    async selectPlan(adminId, dto) {
        const admin = await this.adminModel.findById(adminId);
        if (!admin)
            throw new common_1.NotFoundException("Admin not found");
        const selectedPlan = await this.planModel.findById(dto.planId);
        if (!selectedPlan)
            throw new common_1.BadRequestException("Invalid plan selected");
        admin.plan = selectedPlan._id;
        const now = new Date();
        let expiresAt;
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
                throw new common_1.BadRequestException("Unknown plan type");
        }
        admin.planExpiresAt = expiresAt;
        admin.activeAccount = true;
        await admin.save();
        return {
            message: `Plan updated to ${selectedPlan.label}`,
            expiresAt,
        };
    }
    async getProfile(user) {
        if (user.role === "admin") {
            const adminDoc = await this.adminModel
                .findOne({ mobileNo: user.mobileNo })
                .populate("plan");
            if (!adminDoc)
                throw new common_1.NotFoundException("Admin not found");
            const admin = adminDoc;
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
            if (!adminDoc)
                throw new common_1.NotFoundException("Admin (owner) not found");
            const admin = adminDoc;
            const manager = admin.managers.find((m) => m.mobile === user.mobileNo);
            if (!manager)
                throw new common_1.NotFoundException("Manager not found");
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
        throw new common_1.BadRequestException("Invalid role or user context");
    }
    async getMachineDetails(adminId) {
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
    async creditSalary(pumpId, staffId, dto) {
        const admin = await this.adminModel.findById(pumpId);
        if (!admin)
            throw new common_1.NotFoundException("Admin not found");
        const staff = admin.staff.id(staffId);
        if (!staff)
            throw new common_1.NotFoundException("Staff not found");
        let creditedAmount = 0;
        switch (dto.mode) {
            case create_user_dto_1.SalaryMode.FULL:
                creditedAmount = staff.salary;
                break;
            case create_user_dto_1.SalaryMode.MINUS_CREDIT:
                creditedAmount = staff.salary - staff.credit;
                break;
            case create_user_dto_1.SalaryMode.CUSTOM:
                creditedAmount = dto.amount;
                break;
            default:
                throw new common_1.BadRequestException("Invalid salary mode");
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
    async addCredit(pumpId, staffId, dto) {
        const admin = await this.adminModel.findById(pumpId);
        if (!admin)
            throw new common_1.NotFoundException("Pump not found");
        const staff = admin.staff.id(staffId);
        if (!staff)
            throw new common_1.NotFoundException("Staff not found");
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
    async getTransactions(pumpId, staffId) {
        const admin = await this.adminModel
            .findById(pumpId)
            .lean();
        if (!admin)
            throw new common_1.NotFoundException("Pump not found");
        const staff = admin.staff.find((s) => s._id.toString() === staffId);
        if (!staff)
            throw new common_1.NotFoundException("Staff not found");
        return staff.transactions ?? [];
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(1, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
