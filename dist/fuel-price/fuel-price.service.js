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
exports.FuelPriceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fuel_price_schema_1 = require("./fuel-price.schema");
let FuelPriceService = class FuelPriceService {
    constructor(fuelPriceModel) {
        this.fuelPriceModel = fuelPriceModel;
    }
    async getPrice() {
        const existing = await this.fuelPriceModel.findOne();
        if (!existing)
            throw new common_1.NotFoundException("Fuel prices not found");
        return existing;
    }
    async updatePrice(updates) {
        try {
            const fuelPrice = await this.fuelPriceModel.findOne();
            if (!fuelPrice) {
                const newPrice = new this.fuelPriceModel(updates);
                return await newPrice.save();
            }
            Object.assign(fuelPrice, updates);
            return await fuelPrice.save();
        }
        catch (error) {
            console.error("Update Price Error:", error);
            throw new common_1.InternalServerErrorException("Failed to update fuel prices");
        }
    }
};
exports.FuelPriceService = FuelPriceService;
exports.FuelPriceService = FuelPriceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fuel_price_schema_1.FuelPrice.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FuelPriceService);
//# sourceMappingURL=fuel-price.service.js.map