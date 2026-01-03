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
let ManagerController = class ManagerController {
    constructor(managerService) {
        this.managerService = managerService;
    }
    async addManager(req, dto) {
        return this.managerService.addManager(req.user.adminId, dto);
    }
};
exports.ManagerController = ManagerController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, managers_dto_1.CreateManagerDto]),
    __metadata("design:returntype", Promise)
], ManagerController.prototype, "addManager", null);
exports.ManagerController = ManagerController = __decorate([
    (0, common_1.Controller)("manager"),
    __metadata("design:paramtypes", [managers_service_1.ManagerService])
], ManagerController);
