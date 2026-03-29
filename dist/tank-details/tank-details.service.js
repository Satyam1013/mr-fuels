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
const fuel_product_schema_1 = require("../fuel-product/fuel-product.schema");
let TankService = class TankService {
    constructor(tankModel, fuelProductDetailsModel) {
        this.tankModel = tankModel;
        this.fuelProductDetailsModel = fuelProductDetailsModel;
    }
    async create(adminId, dto) {
        const existing = await this.tankModel.findOne({ adminId });
        if (existing) {
            throw new common_1.ConflictException("Tank details already created for this admin");
        }
        const tank = await this.tankModel.create({
            adminId,
            tanks: dto.tanks.map((t) => ({
                ...t,
                fuelProductId: new mongoose_2.Types.ObjectId(t.fuelProductId),
            })),
        });
        return {
            message: "Tank details created successfully",
            data: tank,
        };
    }
    async findAll(adminId) {
        const [tankDetails, fuelProductDetails] = await Promise.all([
            this.tankModel.findOne({ adminId }).lean(),
            this.fuelProductDetailsModel.findOne({ adminId }).lean(),
        ]);
        if (!tankDetails)
            return [];
        const tanks = tankDetails.tanks.map((tank) => {
            const product = fuelProductDetails?.products.find((p) => p._id.toString() ===
                tank.fuelProductId.toString());
            return {
                ...tank,
                fuelType: product?.fuelType,
                price: product?.price,
                purchasingPrice: product?.purchasingPrice,
            };
        });
        return tanks;
    }
    async findOne(id) {
        const tankDoc = await this.tankModel.findById(id).lean();
        if (!tankDoc)
            throw new common_1.NotFoundException("Tank not found");
        const fuelProductDetails = await this.fuelProductDetailsModel
            .findOne({ adminId: tankDoc.adminId })
            .lean();
        const tanks = tankDoc.tanks.map((tank) => {
            const product = fuelProductDetails?.products.find((p) => p._id.toString() ===
                tank.fuelProductId.toString());
            return {
                ...tank,
                fuelType: product?.fuelType,
                price: product?.price,
                purchasingPrice: product?.purchasingPrice,
            };
        });
        return { ...tankDoc, tanks };
    }
    async updateMany(adminId, dto) {
        if (!dto.tanks || dto.tanks.length === 0) {
            throw new common_1.NotFoundException("No tanks provided for update");
        }
        const tankDoc = await this.tankModel.findOne({ adminId });
        if (!tankDoc)
            throw new common_1.NotFoundException("Tank document not found");
        dto.tanks.forEach((updateTank) => {
            const tank = tankDoc.tanks.find((t) => updateTank._id && String(t._id) === String(updateTank._id));
            if (tank) {
                tank.capacityKl = updateTank.capacityKl ?? tank.capacityKl;
                tank.dsrTankStock = updateTank.dsrTankStock ?? tank.dsrTankStock;
                tank.tankNo = updateTank.tankNo ?? tank.tankNo;
                if (updateTank.fuelProductId) {
                    tank.fuelProductId = new mongoose_2.Types.ObjectId(updateTank.fuelProductId);
                }
            }
        });
        await tankDoc.save();
        return {
            message: "Tanks updated successfully",
            data: tankDoc,
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
    __param(1, (0, mongoose_1.InjectModel)(fuel_product_schema_1.FuelProductDetails.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TankService);
