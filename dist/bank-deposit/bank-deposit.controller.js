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
exports.BankDepositController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const bank_deposit_service_1 = require("./bank-deposit.service");
const bank_deposit_dto_1 = require("./bank-deposit.dto");
const bank_deposit_dto_2 = require("./bank-deposit.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
let BankDepositController = class BankDepositController {
    constructor(bankDepositService) {
        this.bankDepositService = bankDepositService;
    }
    // POST /bank-deposit
    async create(dto, adminId) {
        return this.bankDepositService.create(adminId, dto);
    }
    // GET /bank-deposit?date=2026-04-17&shiftNumber=1
    async findAll(date, shiftNumber, adminId) {
        return this.bankDepositService.findAll(adminId, date, Number(shiftNumber));
    }
    // PATCH /bank-deposit/:id
    async update(id, dto, adminId) {
        return this.bankDepositService.update(adminId, id, dto);
    }
};
exports.BankDepositController = BankDepositController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bank_deposit_dto_1.CreateBankDepositDto, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], BankDepositController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("date")),
    __param(1, (0, common_1.Query)("shiftNumber")),
    __param(2, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], BankDepositController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bank_deposit_dto_2.UpdateBankDepositDto, mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], BankDepositController.prototype, "update", null);
exports.BankDepositController = BankDepositController = __decorate([
    (0, common_1.Controller)("bank-deposit"),
    __metadata("design:paramtypes", [bank_deposit_service_1.BankDepositService])
], BankDepositController);
