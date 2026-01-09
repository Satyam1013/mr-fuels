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
exports.DsrDetailsController = void 0;
const common_1 = require("@nestjs/common");
const dsr_service_1 = require("./dsr.service");
const dsr_dto_1 = require("./dsr.dto");
let DsrDetailsController = class DsrDetailsController {
    constructor(dsrService) {
        this.dsrService = dsrService;
    }
    async addOrUpdate(req, dto) {
        const adminId = req.user.adminId;
        return this.dsrService.addOrUpdate(adminId, dto);
    }
    async getMyDsr(req) {
        const adminId = req.user.adminId;
        return this.dsrService.getByAdmin(adminId);
    }
};
exports.DsrDetailsController = DsrDetailsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dsr_dto_1.CreateDsrDetailsDto]),
    __metadata("design:returntype", Promise)
], DsrDetailsController.prototype, "addOrUpdate", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DsrDetailsController.prototype, "getMyDsr", null);
exports.DsrDetailsController = DsrDetailsController = __decorate([
    (0, common_1.Controller)("dsr-details"),
    __metadata("design:paramtypes", [dsr_service_1.DsrDetailsService])
], DsrDetailsController);
