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
exports.SellsController = void 0;
const common_1 = require("@nestjs/common");
const sells_service_1 = require("./sells.service");
let SellsController = class SellsController {
    constructor(sellsService) {
        this.sellsService = sellsService;
    }
    async getDashboardSetup(req) {
        const adminId = req.user.adminId;
        return this.sellsService.getDashboardSetup(adminId);
    }
    async getShiftDashboard(req) {
        const adminId = req.user.adminId;
        return this.sellsService.getShiftDashboard(adminId);
    }
};
exports.SellsController = SellsController;
__decorate([
    (0, common_1.Get)("dashboard-setup"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SellsController.prototype, "getDashboardSetup", null);
__decorate([
    (0, common_1.Get)("shift-dashboard"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SellsController.prototype, "getShiftDashboard", null);
exports.SellsController = SellsController = __decorate([
    (0, common_1.Controller)("sells"),
    __metadata("design:paramtypes", [sells_service_1.SellsService])
], SellsController);
