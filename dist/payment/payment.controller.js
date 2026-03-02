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
exports.UpiController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const payment_service_1 = require("./payment.service");
let UpiController = class UpiController {
    constructor(upiService) {
        this.upiService = upiService;
    }
    async submitUpiPayments(files, body, req) {
        const adminId = req.user.adminId;
        let parsedPayments;
        try {
            parsedPayments = JSON.parse(body.upiPayments);
        }
        catch {
            throw new common_1.BadRequestException("Invalid upiPayments JSON format");
        }
        const parsedDto = {
            date: body.date,
            shiftId: Number(body.shiftId),
            upiPayments: parsedPayments,
        };
        return this.upiService.submitUpiPayments(adminId, parsedDto, files);
    }
};
exports.UpiController = UpiController;
__decorate([
    (0, common_1.Post)("submit-upi"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)("files")),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], UpiController.prototype, "submitUpiPayments", null);
exports.UpiController = UpiController = __decorate([
    (0, common_1.Controller)("payments"),
    __metadata("design:paramtypes", [payment_service_1.UpiService])
], UpiController);
