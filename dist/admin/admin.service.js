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
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_schema_1 = require("./admin.schema");
const mongoose_2 = require("mongoose");
const plan_schema_1 = require("../plan/plan.schema");
let AdminService = class AdminService {
    constructor(adminModel, planModel) {
        this.adminModel = adminModel;
        this.planModel = planModel;
    }
    async selectPlan(adminId, dto) {
        const admin = await this.adminModel.findById(adminId);
        if (!admin)
            throw new common_1.NotFoundException("Admin not found");
        const selectedPlan = await this.planModel.findById(dto.planId);
        if (!selectedPlan)
            throw new common_1.BadRequestException("Invalid plan selected");
        // Set plan reference
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
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(1, (0, mongoose_1.InjectModel)(plan_schema_1.Plan.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
