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
exports.MachineCalculationController = void 0;
const common_1 = require("@nestjs/common");
const machine_calculation_service_1 = require("./machine-calculation.service");
const machine_calculation_dto_1 = require("./machine-calculation.dto");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const mongoose_1 = require("mongoose");
let MachineCalculationController = class MachineCalculationController {
    constructor(machineCalculationService) {
        this.machineCalculationService = machineCalculationService;
    }
    create(adminId, dto) {
        return this.machineCalculationService.create(adminId, dto);
    }
    async getNozzleDetails(adminId, query) {
        return this.machineCalculationService.getNozzleDetails(adminId, query.machineId);
    }
    getAll(adminId) {
        return this.machineCalculationService.getAll(adminId);
    }
    getMachineDetails(adminId, machineId, date, nozzleNumber, shiftNumber) {
        return this.machineCalculationService.getMachineDetails(adminId, machineId, date, nozzleNumber, shiftNumber);
    }
    getById(id) {
        return this.machineCalculationService.getById(id);
    }
    update(id, adminId, dto) {
        return this.machineCalculationService.update(adminId, id, dto);
    }
    remove(id) {
        return this.machineCalculationService.remove(id);
    }
};
exports.MachineCalculationController = MachineCalculationController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, machine_calculation_dto_1.CreateMachineCalculationDto]),
    __metadata("design:returntype", void 0)
], MachineCalculationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("nozzle-details"),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, machine_calculation_dto_1.GetNozzleDetailsDto]),
    __metadata("design:returntype", Promise)
], MachineCalculationController.prototype, "getNozzleDetails", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId]),
    __metadata("design:returntype", void 0)
], MachineCalculationController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("machine-details"),
    __param(0, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(1, (0, common_1.Query)("machineId")),
    __param(2, (0, common_1.Query)("date")),
    __param(3, (0, common_1.Query)("nozzleNumber")),
    __param(4, (0, common_1.Query)("shiftNumber")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], MachineCalculationController.prototype, "getMachineDetails", null);
__decorate([
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MachineCalculationController.prototype, "getById", null);
__decorate([
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, get_user_decoration_1.GetUser)("adminId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, mongoose_1.Types.ObjectId, machine_calculation_dto_1.UpdateMachineCalculationDto]),
    __metadata("design:returntype", void 0)
], MachineCalculationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MachineCalculationController.prototype, "remove", null);
exports.MachineCalculationController = MachineCalculationController = __decorate([
    (0, common_1.Controller)("machine-calculation"),
    __metadata("design:paramtypes", [machine_calculation_service_1.MachineCalculationService])
], MachineCalculationController);
