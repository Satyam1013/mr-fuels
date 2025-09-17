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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const plan_dto_1 = require("../plan/plan.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const create_user_dto_1 = require("../auth/create-user.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async addStaff(pumpId, dto) {
        const staff = await this.adminService.addStaff(pumpId, dto);
        return staff;
    }
    // Get staff list
    async getStaff(pumpId) {
        const staff = await this.adminService.getStaff(pumpId);
        return staff;
    }
    // Update staff details
    async updateStaff(pumpId, staffId, update) {
        const staff = await this.adminService.updateStaff(pumpId, staffId, update);
        return staff;
    }
    async updatePlan(req, dto) {
        const adminId = req.user.sub;
        return this.adminService.selectPlan(adminId, dto);
    }
    async getProfile(req) {
        return this.adminService.getProfile(req.user);
    }
    async getMachineDetails(req) {
        const adminId = req.user.sub;
        return this.adminService.getMachineDetails(adminId);
    }
    async creditSalary(staffId, dto, pumpId) {
        return this.adminService.creditSalary(pumpId, staffId, dto);
    }
    async addCredit(staffId, dto, pumpId) {
        return this.adminService.addCredit(pumpId, staffId, dto);
    }
    async getTransactions(staffId, pumpId) {
        return this.adminService.getTransactions(pumpId, staffId);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)("add-staff"),
    __param(0, (0, get_user_decoration_1.GetUser)("pumpId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_dto_1.CreateStaffDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addStaff", null);
__decorate([
    (0, common_1.Get)("staff"),
    __param(0, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStaff", null);
__decorate([
    (0, common_1.Patch)("staff/:staffId"),
    __param(0, (0, get_user_decoration_1.GetUser)("pumpId")),
    __param(1, (0, common_1.Param)("staffId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateStaff", null);
__decorate([
    (0, common_1.Patch)("plan"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, plan_dto_1.SelectPlanDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Get)("profile"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Get)("machine-details"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMachineDetails", null);
__decorate([
    (0, common_1.Post)("staff/:staffId/credit-salary"),
    __param(0, (0, common_1.Param)("staffId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_dto_1.CreditSalaryDto, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "creditSalary", null);
__decorate([
    (0, common_1.Post)("staff/:staffId/add-credit"),
    __param(0, (0, common_1.Param)("staffId")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_user_dto_1.AddCreditDto, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "addCredit", null);
__decorate([
    (0, common_1.Get)("staff/:staffId/transactions"),
    __param(0, (0, common_1.Param)("staffId")),
    __param(1, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTransactions", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)("admin"),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
