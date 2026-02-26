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
const mongoose_2 = require("mongoose");
const admin_schema_1 = require("../admin/admin.schema");
const plan_details_schema_1 = require("../plan-details/plan-details.schema");
const subscription_schema_1 = require("../subscription/subscription.schema");
const plan_details_enums_1 = require("../plan-details/plan-details.enums");
let AdminService = class AdminService {
    constructor(adminModel, planModel, subscriptionModel) {
        this.adminModel = adminModel;
        this.planModel = planModel;
        this.subscriptionModel = subscriptionModel;
    }
    async selectPlan(adminId, planId) {
        const plan = await this.planModel.findById(planId);
        if (!plan) {
            throw new common_1.BadRequestException("Plan not found");
        }
        if (plan.status !== plan_details_enums_1.PlanStatus.ACTIVE) {
            throw new common_1.BadRequestException("Plan is not active");
        }
        const existingSubscription = await this.subscriptionModel.findOne({
            adminId,
            status: subscription_schema_1.SubscriptionStatus.ACTIVE,
        });
        if (existingSubscription) {
            throw new common_1.BadRequestException("Active subscription already exists");
        }
        const startDate = new Date();
        const expiryDate = new Date(startDate);
        const trialEnabled = plan.trial?.enabled ?? false;
        const trialDays = plan.trial?.trialDays ?? 0;
        const durationMonths = plan.duration?.months ?? 0;
        if (trialEnabled && trialDays > 0) {
            expiryDate.setDate(expiryDate.getDate() + trialDays);
        }
        else {
            if (durationMonths <= 0) {
                throw new common_1.BadRequestException("Invalid plan duration");
            }
            expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
        }
        if (isNaN(expiryDate.getTime())) {
            throw new common_1.BadRequestException("Expiry calculation failed");
        }
        const subscription = await this.subscriptionModel.create({
            adminId,
            planId,
            startDate,
            expiryDate,
            status: subscription_schema_1.SubscriptionStatus.ACTIVE,
        });
        await this.adminModel.findByIdAndUpdate(adminId, {
            currentSubscriptionId: subscription._id,
        });
        return {
            success: true,
            message: "Plan selected successfully",
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(1, (0, mongoose_1.InjectModel)(plan_details_schema_1.Plan.name)),
    __param(2, (0, mongoose_1.InjectModel)(subscription_schema_1.Subscription.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminService);
