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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const sales_service_1 = require("./sales.service");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const mongoose_1 = require("mongoose");
const sales_dto_1 = require("./sales.dto");
let SalesController = class SalesController {
    constructor(salesService) {
        this.salesService = salesService;
    }
    async createSale(dto, adminId) {
        return this.salesService.createSale(adminId, dto);
    }
    async getDashboardSetup(adminId) {
        return this.salesService.getDashboardSetup(adminId);
    }
    async getReport(date, shiftNumber, filterType, startDate, endDate, calculationMode, adminId) {
        // Single shift
        if (date && shiftNumber) {
            return this.salesService.getSalesReport({
                adminId,
                type: "single",
                date,
                shiftNumber: Number(shiftNumber),
            });
        }
        // Daily
        if (filterType === "daily") {
            return this.salesService.getSalesReport({
                adminId,
                type: "range",
                filterType,
                startDate: date,
                endDate: date,
                calculationMode,
            });
        }
        // Weekly / Monthly / Custom
        return this.salesService.getSalesReport({
            adminId,
            type: "range",
            filterType,
            startDate,
            endDate,
            calculationMode,
        });
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sales_dto_1.CreateSaleDto, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "createSale", null);
__decorate([
    (0, common_1.Get)("dashboard-setup"),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getDashboardSetup", null);
__decorate([
    (0, common_1.Get)("report"),
    __param(0, (0, common_1.Query)("date")),
    __param(1, (0, common_1.Query)("shiftNumber")),
    __param(2, (0, common_1.Query)("filterType")),
    __param(3, (0, common_1.Query)("startDate")),
    __param(4, (0, common_1.Query)("endDate")),
    __param(5, (0, common_1.Query)("calculationMode")),
    __param(6, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getReport", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.Controller)("sales"),
    __metadata("design:paramtypes", [sales_service_1.SalesService])
], SalesController);
