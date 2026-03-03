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
exports.ShiftMachineService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_machine_schema_1 = require("./schemas/shift-machine.schema");
const machines_schema_1 = require("../machines/machines.schema");
let ShiftMachineService = class ShiftMachineService {
    constructor(shiftModel, machineModel) {
        this.shiftModel = shiftModel;
        this.machineModel = machineModel;
    }
    async create(adminId, dto) {
        const machine = await this.machineModel.findOne({
            adminId,
            machineNumber: dto.machineName,
        });
        if (!machine) {
            throw new common_1.BadRequestException("Machine not found");
        }
        let totalMachineAmount = 0;
        const calculatedNozzles = dto.nozzles.map((n) => {
            const totalSaleLiters = n.currentReading -
                n.lastReading -
                n.testingLiters -
                n.faultTestingLiters;
            const totalAmount = totalSaleLiters * n.pricePerLiter;
            totalMachineAmount += totalAmount;
            return {
                ...n,
                totalSaleLiters,
                totalAmount,
            };
        });
        const saved = await this.shiftModel.create({
            adminId: new mongoose_2.Types.ObjectId(adminId),
            date: dto.date,
            shiftId: dto.shiftId,
            shiftNumber: dto.shiftNumber,
            machineId: machine._id,
            nozzles: calculatedNozzles,
            totalMachineAmount,
        });
        return {
            message: "Shift machine entry saved successfully",
            data: saved,
        };
    }
};
exports.ShiftMachineService = ShiftMachineService;
exports.ShiftMachineService = ShiftMachineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shift_machine_schema_1.ShiftMachineEntry.name)),
    __param(1, (0, mongoose_1.InjectModel)(machines_schema_1.Machine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ShiftMachineService);
