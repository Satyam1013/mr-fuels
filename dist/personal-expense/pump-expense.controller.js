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
exports.PumpExpenseController = void 0;
const common_1 = require("@nestjs/common");
const pump_expense_service_1 = require("./pump-expense.service");
const pump_expense_dto_1 = require("./pump-expense.dto");
let PumpExpenseController = class PumpExpenseController {
    constructor(pumpExpenseService) {
        this.pumpExpenseService = pumpExpenseService;
    }
    create(dto, req) {
        const adminId = req.user.adminId;
        return this.pumpExpenseService.create(adminId, dto);
    }
    findAll(req) {
        const adminId = req.user.adminId;
        return this.pumpExpenseService.findAll(adminId);
    }
    findOne(id) {
        return this.pumpExpenseService.findOne(id);
    }
    remove(id) {
        return this.pumpExpenseService.remove(id);
    }
};
exports.PumpExpenseController = PumpExpenseController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pump_expense_dto_1.CreatePumpExpenseDto, Object]),
    __metadata("design:returntype", void 0)
], PumpExpenseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PumpExpenseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PumpExpenseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PumpExpenseController.prototype, "remove", null);
exports.PumpExpenseController = PumpExpenseController = __decorate([
    (0, common_1.Controller)("pump-expense"),
    __metadata("design:paramtypes", [pump_expense_service_1.PumpExpenseService])
], PumpExpenseController);
