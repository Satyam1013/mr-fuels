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
const get_user_decoration_1 = require("../auth/get-user.decoration");
const mongoose_1 = require("mongoose");
let DsrDetailsController = class DsrDetailsController {
    constructor(dsrService) {
        this.dsrService = dsrService;
    }
    async addOrUpdate(adminId, dto) {
        return this.dsrService.addOrUpdate(adminId, dto);
    }
    async getMyDsr(adminId) {
        return this.dsrService.getByAdmin(adminId);
    }
    async updateDsr(adminId, dto) {
        return this.dsrService.updateDsr(adminId, dto);
    }
    async deleteDsr(adminId) {
        return this.dsrService.deleteDsr(adminId);
    }
};
exports.DsrDetailsController = DsrDetailsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, dsr_dto_1.CreateDsrDetailsDto]),
    __metadata("design:returntype", Promise)
], DsrDetailsController.prototype, "addOrUpdate", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], DsrDetailsController.prototype, "getMyDsr", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, dsr_dto_1.CreateDsrDetailsDto]),
    __metadata("design:returntype", Promise)
], DsrDetailsController.prototype, "updateDsr", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], DsrDetailsController.prototype, "deleteDsr", null);
exports.DsrDetailsController = DsrDetailsController = __decorate([
    (0, common_1.Controller)("dsr-details"),
    __metadata("design:paramtypes", [dsr_service_1.DsrDetailsService])
], DsrDetailsController);
