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
exports.ManagerController = void 0;
const common_1 = require("@nestjs/common");
const managers_service_1 = require("./managers.service");
const managers_dto_1 = require("./managers.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const mongoose_1 = require("mongoose");
let ManagerController = class ManagerController {
    constructor(managerService) {
        this.managerService = managerService;
    }
    async addManagers(adminId, body) {
        return this.managerService.addManagers(adminId, body);
    }
    async getManagers(adminId) {
        return this.managerService.getManagers(adminId);
    }
    async updateManager(id, body) {
        return this.managerService.updateManager(id, body);
    }
    async deleteManager(id) {
        return this.managerService.deleteManager(id);
    }
};
exports.ManagerController = ManagerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, managers_dto_1.BulkCreateManagerDto]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "addManagers", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "getManagers", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, managers_dto_1.UpdateManagerDto]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "updateManager", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "deleteManager", null);
exports.ManagerController = ManagerController = __decorate([
    (0, common_1.Controller)("manager"),
    __metadata("design:paramtypes", [managers_service_1.ManagerService])
], ManagerController);
