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
exports.DigitalPaymentController = void 0;
const common_1 = require("@nestjs/common");
const digital_payment_service_1 = require("./digital-payment.service");
const digital_payment_dto_1 = require("./digital-payment.dto");
let DigitalPaymentController = class DigitalPaymentController {
    constructor(digitalService) {
        this.digitalService = digitalService;
    }
    async create(req, dto) {
        return this.digitalService.create(req.user.adminId, dto);
    }
    async findAll(req) {
        return this.digitalService.findAll(req.user.adminId);
    }
    async findByShift(req, date, shiftId) {
        return this.digitalService.findByShift(req.user.adminId, date, Number(shiftId));
    }
};
exports.DigitalPaymentController = DigitalPaymentController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, digital_payment_dto_1.CreateDigitalPaymentDto]),
    __metadata("design:returntype", Promise)
], DigitalPaymentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DigitalPaymentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("shift"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)("date")),
    __param(2, (0, common_1.Query)("shiftId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number]),
    __metadata("design:returntype", Promise)
], DigitalPaymentController.prototype, "findByShift", null);
exports.DigitalPaymentController = DigitalPaymentController = __decorate([
    (0, common_1.Controller)("digital-payments"),
    __metadata("design:paramtypes", [digital_payment_service_1.DigitalPaymentService])
], DigitalPaymentController);
