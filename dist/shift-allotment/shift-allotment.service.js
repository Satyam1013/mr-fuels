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
exports.ShiftAllotmentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_allotment_schema_1 = require("./shift-allotment.schema");
let ShiftAllotmentService = class ShiftAllotmentService {
    constructor(shiftAllotmentModel) {
        this.shiftAllotmentModel = shiftAllotmentModel;
    }
    async create(adminId, dto) {
        const existing = await this.shiftAllotmentModel.findOne({
            adminId,
            shiftId: dto.shiftId,
        });
        if (existing) {
            throw new common_1.ConflictException(`Shift allotment for shiftId "${dto.shiftId}" already exists`);
        }
        return this.shiftAllotmentModel.create({
            ...dto,
            adminId,
            managers: dto.managers.map((id) => new mongoose_2.Types.ObjectId(id)),
            machines: dto.machines.map((m) => ({
                ...m,
                nozzles: m.nozzles.map((n) => ({
                    ...n,
                    staffId: new mongoose_2.Types.ObjectId(n.staffId),
                    inactiveStatus: n.inactiveStatus ?? null,
                })),
            })),
        });
    }
    async findAll(adminId) {
        return this.shiftAllotmentModel
            .find({ adminId })
            .populate("managers", "managerName phone")
            .lean();
    }
    async findOne(adminId, id) {
        const doc = await this.shiftAllotmentModel
            .findOne({ _id: new mongoose_2.Types.ObjectId(id), adminId })
            .populate("managers", "managerName phone")
            .lean();
        if (!doc)
            throw new common_1.NotFoundException("Shift allotment not found");
        return doc;
    }
    async update(adminId, id, dto) {
        const existing = await this.shiftAllotmentModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!existing)
            throw new common_1.NotFoundException("Shift allotment not found");
        if (dto.managers) {
            existing.managers = dto.managers.map((m) => new mongoose_2.Types.ObjectId(m));
        }
        if (dto.machines) {
            existing.machines = dto.machines.map((m) => ({
                machineId: m.machineId,
                nozzles: m.nozzles.map((n) => ({
                    nozzleId: n.nozzleId,
                    staffId: new mongoose_2.Types.ObjectId(n.staffId),
                    nozzleStatus: n.nozzleStatus,
                    inactiveStatus: n.inactiveStatus ?? null,
                })),
            }));
        }
        if (dto.shiftId)
            existing.shiftId = dto.shiftId;
        return existing.save();
    }
    async remove(adminId, id) {
        const doc = await this.shiftAllotmentModel.findOneAndDelete({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!doc)
            throw new common_1.NotFoundException("Shift allotment not found");
        return { deleted: true };
    }
};
exports.ShiftAllotmentService = ShiftAllotmentService;
exports.ShiftAllotmentService = ShiftAllotmentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shift_allotment_schema_1.ShiftAllotment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ShiftAllotmentService);
