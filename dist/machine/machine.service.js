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
const machine_schema_1 = require("./machine.schema");
let MachineService = class MachineService {
    constructor(machineModel) {
        this.machineModel = machineModel;
    }
    async createMachine(data) {
        try {
            const machine = new this.machineModel(data);
            return await machine.save();
        }
        catch (error) {
            console.error("Create Machine Error:", error);
            throw new common_1.InternalServerErrorException("Could not create machine");
        }
    }
    async updateMachine(id, updates) {
        try {
            const updated = await this.machineModel.findByIdAndUpdate(id, updates, {
                new: true,
            });
            if (!updated)
                throw new common_1.NotFoundException("Machine not found");
            return updated;
        }
        catch (error) {
            console.error("Update Machine Error:", error);
            throw new common_1.InternalServerErrorException("Could not update machine");
        }
    }
    async deleteMachine(id) {
        try {
            const deleted = await this.machineModel.findByIdAndDelete(id);
            if (!deleted)
                throw new common_1.NotFoundException("Machine not found");
            return deleted;
        }
        catch (error) {
            console.error("Delete Machine Error:", error);
            throw new common_1.InternalServerErrorException("Could not delete machine");
        }
    }
    async getAllMachines() {
        return this.machineModel
            .find()
            .select("machineNo nozzleNo fuelType readings");
    }
    async updateReading(id, startDayReading) {
        try {
            const machine = await this.machineModel.findById(id);
            if (!machine)
                throw new common_1.NotFoundException("Machine not found");
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            machine.readings.push({
                date: tomorrow,
                reading: startDayReading,
            });
            return await machine.save();
        }
        catch (err) {
            console.error("Error updating reading", err);
            throw new common_1.InternalServerErrorException("Failed to update reading");
        }
    }
};
exports.MachineService = MachineService;
exports.MachineService = MachineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(machine_schema_1.Machine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MachineService);
//# sourceMappingURL=machine.service.js.map