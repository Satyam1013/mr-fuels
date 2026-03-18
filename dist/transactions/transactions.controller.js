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
exports.TransactionDetailsController = void 0;
const common_1 = require("@nestjs/common");
const transactions_service_1 = require("./transactions.service");
const transactions_dto_1 = require("./transactions.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const mongoose_1 = require("mongoose");
let TransactionDetailsController = class TransactionDetailsController {
    constructor(transactionDetailsService) {
        this.transactionDetailsService = transactionDetailsService;
    }
    async addTransactionDetails(adminId, dto) {
        return this.transactionDetailsService.addTransactionDetails(adminId, dto);
    }
    async getTransactionDetails(adminId) {
        return this.transactionDetailsService.getTransactionDetails(adminId);
    }
    async updateTransactionDetails(adminId, dto) {
        return this.transactionDetailsService.updateTransactionDetails(adminId, dto);
    }
    async deleteTransactionDetails(adminId) {
        return this.transactionDetailsService.deleteTransactionDetails(adminId);
    }
};
exports.TransactionDetailsController = TransactionDetailsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, transactions_dto_1.CreateTransactionDetailsDto]),
    __metadata("design:returntype", Promise)
], TransactionDetailsController.prototype, "addTransactionDetails", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], TransactionDetailsController.prototype, "getTransactionDetails", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, transactions_dto_1.CreateTransactionDetailsDto]),
    __metadata("design:returntype", Promise)
], TransactionDetailsController.prototype, "updateTransactionDetails", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], TransactionDetailsController.prototype, "deleteTransactionDetails", null);
exports.TransactionDetailsController = TransactionDetailsController = __decorate([
    (0, common_1.Controller)("transactions"),
    __metadata("design:paramtypes", [transactions_service_1.TransactionDetailsService])
], TransactionDetailsController);
