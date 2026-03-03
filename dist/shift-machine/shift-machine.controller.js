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
exports.ShiftMachineController = void 0;
const common_1 = require("@nestjs/common");
const shift_machine_service_1 = require("./shift-machine.service");
const shift_machine_dto_1 = require("./shift-machine.dto");
let ShiftMachineController = class ShiftMachineController {
    constructor(service) {
        this.service = service;
    }
    async create(dto, req) {
        const adminId = req.user.adminId;
        return this.service.create(adminId, dto);
    }
};
exports.ShiftMachineController = ShiftMachineController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [shift_machine_dto_1.CreateShiftMachineDto, Object]),
    __metadata("design:returntype", Promise)
], ShiftMachineController.prototype, "create", null);
exports.ShiftMachineController = ShiftMachineController = __decorate([
    (0, common_1.Controller)("shift-machine"),
    __metadata("design:paramtypes", [shift_machine_service_1.ShiftMachineService])
], ShiftMachineController);
