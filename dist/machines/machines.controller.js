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
exports.MachineController = void 0;
const common_1 = require("@nestjs/common");
const machines_service_1 = require("./machines.service");
const machines_dto_1 = require("./machines.dto");
let MachineController = class MachineController {
    constructor(machineService) {
        this.machineService = machineService;
    }
    // Create machine
    async createMachine(req, dto) {
        const adminId = req.user.adminId;
        return this.machineService.createMachine(adminId, dto);
    }
    // Get all machines of admin
    async getMachines(req) {
        const adminId = req.user.adminId;
        return this.machineService.getMachines(adminId);
    }
    // Get single machine
    async getMachineById(id) {
        return this.machineService.getMachineById(id);
    }
    // Update machine
    async updateMachine(id, dto) {
        return this.machineService.updateMachine(id, dto);
    }
    // Delete machine
    async deleteMachine(id) {
        return this.machineService.deleteMachine(id);
    }
};
exports.MachineController = MachineController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, machines_dto_1.CreateMachineDto]),
    __metadata("design:returntype", Promise)
], MachineController.prototype, "createMachine", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MachineController.prototype, "getMachines", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MachineController.prototype, "getMachineById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MachineController.prototype, "updateMachine", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MachineController.prototype, "deleteMachine", null);
exports.MachineController = MachineController = __decorate([
    (0, common_1.Controller)("machines"),
    __metadata("design:paramtypes", [machines_service_1.MachineService])
], MachineController);
