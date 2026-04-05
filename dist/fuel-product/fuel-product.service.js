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
exports.FuelProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fuel_product_schema_1 = require("./fuel-product.schema");
let FuelProductService = class FuelProductService {
    constructor(fuelProductDetailsModel) {
        this.fuelProductDetailsModel = fuelProductDetailsModel;
    }
    // ── Add product to array ─────────────────────────────────────────────────
    async create(adminId, dto) {
        // Check karo koi bhi fuelType already exist to nahi karta
        const existing = await this.fuelProductDetailsModel.findOne({
            adminId,
            "products.fuelType": { $in: dto.products.map((p) => p.fuelType) },
        });
        if (existing) {
            const existingTypes = existing.products.map((p) => p.fuelType);
            const duplicates = dto.products
                .map((p) => p.fuelType)
                .filter((ft) => existingTypes.includes(ft));
            throw new common_1.BadRequestException(`${duplicates.join(", ")} already exists. Use update to change price.`);
        }
        const productsWithDate = dto.products.map((p) => ({
            ...p,
            oldPrice: p.oldPrice ?? p.price,
            updatedPriceFrom: new Date(),
            shiftId: p.shiftId ?? null,
            shiftNumber: p.shiftNumber ?? null,
        }));
        const result = await this.fuelProductDetailsModel.findOneAndUpdate({ adminId }, { $push: { products: { $each: productsWithDate } } }, { upsert: true, new: true });
        return result;
    }
    // ── Get all products of admin ────────────────────────────────────────────
    async findAll(adminId) {
        const record = await this.fuelProductDetailsModel
            .findOne({ adminId })
            .lean();
        return record?.products ?? [];
    }
    // ── Get one by fuelType ──────────────────────────────────────────────────
    async findByFuelType(adminId, fuelType) {
        const record = await this.fuelProductDetailsModel
            .findOne({ adminId })
            .lean();
        const product = record?.products?.find((p) => p.fuelType === fuelType);
        if (!product) {
            throw new common_1.NotFoundException(`${fuelType} fuel product not found.`);
        }
        return product;
    }
    async updatePrice(adminId, dto) {
        const record = await this.fuelProductDetailsModel.findOne({ adminId });
        if (!record) {
            throw new common_1.NotFoundException(`Fuel products not found.`);
        }
        for (const item of dto.products) {
            const product = record.products.find((p) => p.fuelType === item.fuelType);
            if (product) {
                if (item.price !== undefined) {
                    product.oldPrice = product.price;
                    product.price = item.price;
                    product.updatedPriceFrom = new Date();
                }
                if (item.purchasingPrice !== undefined) {
                    product.purchasingPrice = item.purchasingPrice;
                }
                // ✅ Shift info update karo
                if (item.shiftId !== undefined) {
                    product.shiftId = item.shiftId;
                }
                if (item.shiftNumber !== undefined) {
                    product.shiftNumber = item.shiftNumber;
                }
            }
            else {
                record.products.push({
                    _id: new mongoose_2.Types.ObjectId(),
                    fuelType: item.fuelType,
                    price: item.price,
                    oldPrice: item.price,
                    purchasingPrice: item.purchasingPrice,
                    updatedPriceFrom: new Date(),
                    shiftId: item.shiftId ?? null, // ✅
                    shiftNumber: item.shiftNumber ?? null, // ✅
                });
            }
        }
        await record.save();
        return record;
    }
    // ── Delete one product from array ────────────────────────────────────────
    async remove(adminId, fuelType) {
        const result = await this.fuelProductDetailsModel.findOneAndUpdate({ adminId }, { $pull: { products: { fuelType } } }, { new: true });
        if (!result) {
            throw new common_1.NotFoundException(`${fuelType} fuel product not found.`);
        }
        return { message: `${fuelType} fuel product deleted successfully.` };
    }
};
exports.FuelProductService = FuelProductService;
exports.FuelProductService = FuelProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fuel_product_schema_1.FuelProductDetails.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FuelProductService);
