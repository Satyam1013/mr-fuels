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
exports.MachineService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const machines_schema_1 = require("./machines.schema");
let MachineService = class MachineService {
    constructor(machineModel) {
        this.machineModel = machineModel;
    }
    async createMachine(adminId, dto) {
        // Check if machine number already exists for this admin
        const existing = await this.machineModel.findOne({
            adminId,
            machineNo: dto.machineNo,
        });
        if (existing) {
            throw new common_1.BadRequestException("Machine number already exists for this admin");
        }
        const machine = await this.machineModel.create({
            adminId: new mongoose_2.Types.ObjectId(adminId),
            ...dto,
        });
        return machine;
    }
    async getMachines(adminId) {
        return this.machineModel.find({ adminId });
    }
    async getMachineById(machineId) {
        return this.machineModel.findById(machineId);
    }
    async updateMachine(machineId, dto) {
        return this.machineModel.findByIdAndUpdate(machineId, dto, { new: true });
    }
    async deleteMachine(machineId) {
        return this.machineModel.findByIdAndDelete(machineId);
    }
};
exports.MachineService = MachineService;
exports.MachineService = MachineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(machines_schema_1.Machine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MachineService);
