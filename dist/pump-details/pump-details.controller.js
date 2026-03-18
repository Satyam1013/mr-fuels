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
exports.PumpDetailsController = void 0;
const common_1 = require("@nestjs/common");
const pump_details_service_1 = require("./pump-details.service");
const pump_details_dto_1 = require("./pump-details.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const mongoose_1 = require("mongoose");
let PumpDetailsController = class PumpDetailsController {
    constructor(pumpDetailsService) {
        this.pumpDetailsService = pumpDetailsService;
    }
    async addPumpDetails(adminId, dto) {
        return this.pumpDetailsService.addPumpDetails(adminId, dto);
    }
    async getPumpDetails(adminId) {
        return this.pumpDetailsService.getPumpDetails(adminId);
    }
    async updatePumpDetails(adminId, dto) {
        return this.pumpDetailsService.updatePumpDetails(adminId, dto);
    }
    async deletePumpDetails(adminId) {
        return this.pumpDetailsService.deletePumpDetails(adminId);
    }
};
exports.PumpDetailsController = PumpDetailsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, pump_details_dto_1.CreatePumpDetailsDto]),
    __metadata("design:returntype", Promise)
], PumpDetailsController.prototype, "addPumpDetails", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], PumpDetailsController.prototype, "getPumpDetails", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, pump_details_dto_1.UpdatePumpDetailsDto]),
    __metadata("design:returntype", Promise)
], PumpDetailsController.prototype, "updatePumpDetails", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], PumpDetailsController.prototype, "deletePumpDetails", null);
exports.PumpDetailsController = PumpDetailsController = __decorate([
    (0, common_1.Controller)("pump-details"),
    __metadata("design:paramtypes", [pump_details_service_1.PumpDetailsService])
], PumpDetailsController);
