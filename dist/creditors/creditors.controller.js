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
exports.CreditorController = void 0;
const common_1 = require("@nestjs/common");
const creditors_service_1 = require("./creditors.service");
const creditors_dto_1 = require("./creditors.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
let CreditorController = class CreditorController {
    constructor(creditorService) {
        this.creditorService = creditorService;
    }
    create(dto, pumpId) {
        return this.creditorService.create(dto, pumpId);
    }
    findAll(query, pumpId) {
        const { filterType, date } = query;
        return this.creditorService.findAll(pumpId, date, filterType);
    }
    getCreditSummary(query, pumpId) {
        const { filterType, date } = query;
        if (!filterType || !date) {
            throw new common_1.BadRequestException("Both filterType and date are required");
        }
        return this.creditorService.getCreditSummary(pumpId, date, filterType);
    }
    findById(contactId, query, pumpId) {
        const { date, filterType } = query;
        return this.creditorService.findById(contactId, pumpId, date, filterType);
    }
    update(id, dto, pumpId) {
        return this.creditorService.update(id, dto, pumpId);
    }
    delete(id, pumpId) {
        return this.creditorService.delete(id, pumpId);
    }
};
exports.CreditorController = CreditorController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [creditors_dto_1.CreateCreditorDto, String]),
    __metadata("design:returntype", void 0)
], CreditorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [creditors_dto_1.GetCreditorsQueryDto, String]),
    __metadata("design:returntype", void 0)
], CreditorController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("/summary"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [creditors_dto_1.GetCreditorsQueryDto, String]),
    __metadata("design:returntype", void 0)
], CreditorController.prototype, "getCreditSummary", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, creditors_dto_1.GetCreditorsQueryDto, String]),
    __metadata("design:returntype", void 0)
], CreditorController.prototype, "findById", null);
__decorate([
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, creditors_dto_1.UpdateCreditorDto, String]),
    __metadata("design:returntype", void 0)
], CreditorController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CreditorController.prototype, "delete", null);
exports.CreditorController = CreditorController = __decorate([
    (0, common_1.Controller)("creditors"),
    __metadata("design:paramtypes", [creditors_service_1.CreditorService])
], CreditorController);
