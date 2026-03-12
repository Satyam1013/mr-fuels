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
exports.PumpDetailsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pump_details_schema_1 = require("./pump-details.schema");
const admin_schema_1 = require("../admin/admin.schema");
const tank_details_schema_1 = require("../tank-details/tank-details.schema");
let PumpDetailsService = class PumpDetailsService {
    constructor(pumpDetailsModel, adminModel, tankModel) {
        this.pumpDetailsModel = pumpDetailsModel;
        this.adminModel = adminModel;
        this.tankModel = tankModel;
    }
    async addPumpDetails(adminId, dto) {
        const adminExists = await this.adminModel.findById(adminId);
        if (!adminExists) {
            throw new common_1.NotFoundException("Admin not found");
        }
        // 🔹 Check that the tank exists and belongs to this admin
        const tankExists = await this.tankModel.findOne({
            _id: new mongoose_2.Types.ObjectId(dto.tank),
            adminId: new mongoose_2.Types.ObjectId(adminId),
        });
        if (!tankExists) {
            throw new common_1.NotFoundException("Tank not found or does not belong to this admin");
        }
        const payload = {
            adminId: new mongoose_2.Types.ObjectId(adminId),
            ...dto,
            tank: new mongoose_2.Types.ObjectId(dto.tank),
        };
        const existing = await this.pumpDetailsModel.findOne({ adminId });
        if (existing) {
            return this.pumpDetailsModel.findByIdAndUpdate(existing._id, payload, {
                new: true,
            });
        }
        return this.pumpDetailsModel.create(payload);
    }
    async getPumpDetails(adminId) {
        const pumpDetails = await this.pumpDetailsModel
            .findOne({ adminId: new mongoose_2.Types.ObjectId(adminId) })
            .populate("tank");
        if (!pumpDetails)
            throw new common_1.NotFoundException("Pump details not found");
        return pumpDetails;
    }
    // 🔹 Update PumpDetails
    async updatePumpDetails(adminId, dto) {
        const pumpDetails = await this.pumpDetailsModel.findOne({ adminId });
        if (!pumpDetails)
            throw new common_1.NotFoundException("Pump details not found");
        const tankExists = await this.tankModel.findOne({
            _id: new mongoose_2.Types.ObjectId(dto.tank),
            adminId: new mongoose_2.Types.ObjectId(adminId),
        });
        if (!tankExists)
            throw new common_1.NotFoundException("Tank not found or does not belong to this admin");
        const payload = {
            fuelPartner: dto.fuelPartner,
            tank: new mongoose_2.Types.ObjectId(dto.tank),
            pumpTime: dto.pumpTime,
            pumpHours: dto.pumpHours,
            dailyCloseReportTime: dto.dailyCloseReportTime,
            is24Hour: dto.is24Hour ?? false,
        };
        return this.pumpDetailsModel.findByIdAndUpdate(pumpDetails._id, payload, {
            new: true,
        });
    }
    // 🔹 Delete PumpDetails
    async deletePumpDetails(adminId) {
        const pumpDetails = await this.pumpDetailsModel.findOne({ adminId });
        if (!pumpDetails)
            throw new common_1.NotFoundException("Pump details not found");
        await this.pumpDetailsModel.findByIdAndDelete(pumpDetails._id);
        return { message: "Pump details deleted successfully" };
    }
};
exports.PumpDetailsService = PumpDetailsService;
exports.PumpDetailsService = PumpDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pump_details_schema_1.PumpDetails.name)),
    __param(1, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(2, (0, mongoose_1.InjectModel)(tank_details_schema_1.TankDetails.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PumpDetailsService);
