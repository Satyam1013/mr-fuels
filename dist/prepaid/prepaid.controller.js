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
exports.PrepaidController = void 0;
const common_1 = require("@nestjs/common");
const prepaid_service_1 = require("./prepaid.service");
const prepaid_dto_1 = require("./prepaid.dto");
let PrepaidController = class PrepaidController {
    constructor(service) {
        this.service = service;
    }
    create(dto, req) {
        return this.service.create(req.user.adminId, dto);
    }
    findAll(req) {
        return this.service.findAll(req.user.adminId);
    }
};
exports.PrepaidController = PrepaidController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [prepaid_dto_1.CreatePrepaidDto, Object]),
    __metadata("design:returntype", void 0)
], PrepaidController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PrepaidController.prototype, "findAll", null);
exports.PrepaidController = PrepaidController = __decorate([
    (0, common_1.Controller)("prepaid"),
    __metadata("design:paramtypes", [prepaid_service_1.PrepaidService])
], PrepaidController);
