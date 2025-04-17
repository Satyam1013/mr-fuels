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
const machine_service_1 = require("./machine.service");
const machine_dto_1 = require("./machine.dto");
let MachineController = class MachineController {
    constructor(machineService) {
        this.machineService = machineService;
    }
    create(data) {
        return this.machineService.createMachine(data);
    }
    update(id, updates) {
        return this.machineService.updateMachine(id, updates);
    }
    delete(id) {
        return this.machineService.deleteMachine(id);
    }
    getAllMachines() {
        return this.machineService.getAllMachines();
    }
    updateReading(id, data) {
        return this.machineService.updateReading(id, data.startDayReading);
    }
};
exports.MachineController = MachineController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [machine_dto_1.CreateMachineDto]),
    __metadata("design:returntype", void 0)
], MachineController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, machine_dto_1.UpdateMachineDto]),
    __metadata("design:returntype", void 0)
], MachineController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MachineController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MachineController.prototype, "getAllMachines", null);
__decorate([
    (0, common_1.Patch)(":id/reading"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, machine_dto_1.UpdateReadingDto]),
    __metadata("design:returntype", void 0)
], MachineController.prototype, "updateReading", null);
exports.MachineController = MachineController = __decorate([
    (0, common_1.Controller)("machines"),
    __metadata("design:paramtypes", [machine_service_1.MachineService])
], MachineController);
//# sourceMappingURL=machine.controller.js.map