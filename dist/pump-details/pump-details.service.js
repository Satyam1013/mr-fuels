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
const fuel_product_schema_1 = require("../fuel-product/fuel-product.schema");
let PumpDetailsService = class PumpDetailsService {
    constructor(pumpDetailsModel, adminModel, tankModel, fuelProductDetailsModel) {
        this.pumpDetailsModel = pumpDetailsModel;
        this.adminModel = adminModel;
        this.tankModel = tankModel;
        this.fuelProductDetailsModel = fuelProductDetailsModel;
    }
    async addPumpDetails(adminId, dto) {
        const adminExists = await this.adminModel.findById(adminId);
        if (!adminExists) {
            throw new common_1.NotFoundException("Admin not found");
        }
        const tankIdObj = new mongoose_2.Types.ObjectId(dto.tank);
        const tankExists = await this.tankModel.findOne({
            _id: tankIdObj,
            adminId,
        });
        if (!tankExists) {
            throw new common_1.NotFoundException("Tank not found or does not belong to this admin");
        }
        const existing = await this.pumpDetailsModel.findOne({
            adminId,
        });
        if (existing) {
            throw new common_1.ConflictException("Pump details already exist for this admin");
        }
        const payload = {
            adminId,
            ...dto,
            tank: tankIdObj,
        };
        return this.pumpDetailsModel.create(payload);
    }
    async getPumpDetails(adminId) {
        const [pumpDetails, tankDetails, fuelProductDetails] = await Promise.all([
            this.pumpDetailsModel.findOne({ adminId }).lean(),
            this.tankModel.findOne({ adminId }).lean(),
            this.fuelProductDetailsModel.findOne({ adminId }).lean(),
        ]);
        if (!pumpDetails)
            throw new common_1.NotFoundException("Pump details not found");
        const tanks = tankDetails?.tanks.map((t) => {
            const product = fuelProductDetails?.products.find((p) => p._id.toString() ===
                t.fuelProductId.toString());
            return {
                ...t,
                fuelType: product?.fuelType ?? null,
                price: product?.price ?? null,
                purchasingPrice: product?.purchasingPrice ?? null,
            };
        }) ?? [];
        return {
            ...pumpDetails,
            tanks,
        };
    }
    async updatePumpDetails(adminId, dto) {
        const pumpDetails = await this.pumpDetailsModel.findOne({
            adminId,
        });
        if (!pumpDetails) {
            throw new common_1.NotFoundException("Pump details not found");
        }
        if (dto.tank) {
            const tankExists = await this.tankModel.findOne({
                _id: new mongoose_2.Types.ObjectId(dto.tank),
                adminId,
            });
            if (!tankExists) {
                throw new common_1.NotFoundException("Tank not found or does not belong to this admin");
            }
        }
        const payload = {
            fuelPartner: dto.fuelPartner,
            pumpHours: dto.pumpHours,
            numberOfShifts: dto.numberOfShifts,
            pumpTime: dto.pumpTime,
            dailyCloseReportTime: dto.dailyCloseReportTime,
            is24Hour: dto.is24Hour,
        };
        if (dto.tank) {
            payload.tank = new mongoose_2.Types.ObjectId(dto.tank);
        }
        return this.pumpDetailsModel.findOneAndUpdate(adminId, payload, {
            new: true,
        });
    }
    async deletePumpDetails(adminId) {
        const deleted = await this.pumpDetailsModel.findOneAndDelete({
            adminId,
        });
        if (!deleted)
            throw new common_1.NotFoundException("Pump details not found");
        return { message: "Pump details deleted successfully" };
    }
};
exports.PumpDetailsService = PumpDetailsService;
exports.PumpDetailsService = PumpDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(pump_details_schema_1.PumpDetails.name)),
    __param(1, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(2, (0, mongoose_1.InjectModel)(tank_details_schema_1.TankDetails.name)),
    __param(3, (0, mongoose_1.InjectModel)(fuel_product_schema_1.FuelProductDetails.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], PumpDetailsService);
