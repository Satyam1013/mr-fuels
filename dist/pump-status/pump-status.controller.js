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
exports.PumpStatusController = void 0;
// pump-status.controller.ts
const common_1 = require("@nestjs/common");
const pump_status_service_1 = require("./pump-status.service");
const pump_status_dto_1 = require("./pump-status.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const mongoose_1 = require("mongoose");
let PumpStatusController = class PumpStatusController {
    constructor(service) {
        this.service = service;
    }
    create(adminId, dto) {
        return this.service.create(adminId, dto);
    }
    findAll(adminId) {
        return this.service.findAll(adminId);
    }
    updateStatus(id, status) {
        return this.service.updateStatus(id, status);
    }
    remove(id) {
        return this.service.delete(id);
    }
};
exports.PumpStatusController = PumpStatusController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, pump_status_dto_1.CreatePumpStatusDto]),
    __metadata("design:returntype", void 0)
], PumpStatusController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", void 0)
], PumpStatusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(":id/:status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PumpStatusController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PumpStatusController.prototype, "remove", null);
exports.PumpStatusController = PumpStatusController = __decorate([
    (0, common_1.Controller)("pump-status"),
    __metadata("design:paramtypes", [pump_status_service_1.PumpStatusService])
], PumpStatusController);
