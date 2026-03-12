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
    // 🔹 Create
    async create(adminId, dto) {
        const adminIdObj = new mongoose_2.Types.ObjectId(adminId);
        const tank = await this.tankModel.create({
            adminId: adminIdObj,
            ...dto,
        });
        const tankExists = await this.tankModel.findOne({
            adminId: adminIdObj,
        });
        if (tankExists) {
            throw new common_1.ConflictException("Tank already exist for this admin");
        }
        return {
            message: "Tank details created successfully",
            data: tank,
        };
    }
    // 🔹 Get All (by admin)
    async findAll(adminId) {
        const objectAdminId = new mongoose_2.Types.ObjectId(adminId);
        return this.tankModel.find({ adminId: objectAdminId }).lean();
    }
    // 🔹 Get Single
    async findOne(id) {
        const tank = await this.tankModel.findById(id).lean();
        if (!tank)
            throw new common_1.NotFoundException("Tank not found");
        return tank;
    }
    // 🔹 Update
    async update(id, dto) {
        const updated = await this.tankModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
        if (!updated)
            throw new common_1.NotFoundException("Tank not found");
        return {
            message: "Tank updated successfully",
            data: updated,
        };
    }
    // 🔹 Delete
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
