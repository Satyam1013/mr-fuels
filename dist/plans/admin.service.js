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
const plans_schema_1 = require("./plans.schema");
const mongoose_2 = require("mongoose");
const plans_dto_1 = require("./plans.dto");
let AdminService = class AdminService {
    constructor(adminModel) {
        this.adminModel = adminModel;
    }
    async selectPlan(adminId, dto) {
        const admin = await this.adminModel.findById(adminId);
        if (!admin)
            throw new common_1.NotFoundException("Admin not found");
        const now = new Date();
        let expiresAt = null;
        switch (dto.plan) {
            case plans_dto_1.PlanType.FREE:
                expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                admin.planType = "free";
                admin.paidUser = false;
                admin.activeAccount = true;
                admin.freeTrial = true;
                break;
            case plans_dto_1.PlanType.MONTHLY:
                expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                admin.planType = plans_dto_1.PlanType.MONTHLY;
                admin.paidUser = true;
                admin.activeAccount = true;
                admin.freeTrial = false;
                break;
            case plans_dto_1.PlanType.YEARLY:
                expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
                admin.planType = plans_dto_1.PlanType.YEARLY;
                admin.paidUser = true;
                admin.activeAccount = true;
                admin.freeTrial = false;
                break;
            default:
                throw new common_1.BadRequestException("Invalid plan type");
        }
        admin.planExpiresAt = expiresAt;
        await admin.save();
        return {
            message: `Plan updated to ${dto.plan}`,
            expiresAt,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(plans_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], AdminService);
//# sourceMappingURL=admin.service.js.map