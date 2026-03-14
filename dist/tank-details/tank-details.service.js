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
exports.TankService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tank_details_schema_1 = require("./tank-details.schema");
let TankService = class TankService {
    constructor(tankModel) {
        this.tankModel = tankModel;
    }
    async create(adminId, dto) {
        const adminIdObj = new mongoose_2.Types.ObjectId(adminId);
        const existing = await this.tankModel.findOne({ adminId: adminIdObj });
        if (existing) {
            existing.tanks.push(...dto.tanks);
            await existing.save();
            return {
                message: "Tanks added successfully",
                data: existing,
            };
        }
        const tank = await this.tankModel.create({
            adminId: adminIdObj,
            tanks: dto.tanks,
        });
        return {
            message: "Tank details created successfully",
            data: tank,
        };
    }
    async findAll(adminId) {
        const objectAdminId = new mongoose_2.Types.ObjectId(adminId);
        return this.tankModel.find({ adminId: objectAdminId }).lean();
    }
    async findOne(id) {
        const tank = await this.tankModel.findById(id).lean();
        if (!tank)
            throw new common_1.NotFoundException("Tank not found");
        return tank;
    }
    async update(adminId, id, dto) {
        const adminIdObj = new mongoose_2.Types.ObjectId(adminId);
        const updated = await this.tankModel.findOneAndUpdate({ _id: id, adminId: adminIdObj }, dto, { new: true });
        if (!updated)
            throw new common_1.NotFoundException("Tank not found");
        return {
            message: "Tank updated successfully",
            data: updated,
        };
    }
    async remove(id) {
        const deleted = await this.tankModel.findByIdAndDelete(id);
        if (!deleted)
            throw new common_1.NotFoundException("Tank not found");
        return {
            message: "Tank deleted successfully",
        };
    }
};
exports.TankService = TankService;
exports.TankService = TankService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tank_details_schema_1.TankDetails.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TankService);
