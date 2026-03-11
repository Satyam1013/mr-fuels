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
exports.NonFuelProductSellService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const non_fuel_product_sell_schema_1 = require("./non-fuel-product-sell.schema");
const machines_schema_1 = require("../machines/machines.schema");
const non_fuel_product_schema_1 = require("../non-fuel-product/non-fuel-product.schema");
let NonFuelProductSellService = class NonFuelProductSellService {
    constructor(nonFuelSellModel, machineModel, nonFuelProductsModel) {
        this.nonFuelSellModel = nonFuelSellModel;
        this.machineModel = machineModel;
        this.nonFuelProductsModel = nonFuelProductsModel;
    }
    async addProducts(adminId, dtos) {
        const objectAdminId = new mongoose_2.Types.ObjectId(adminId);
        try {
            for (const dto of dtos) {
                const machineId = new mongoose_2.Types.ObjectId(dto.machineId);
                const productId = new mongoose_2.Types.ObjectId(dto.productId);
                const machine = await this.machineModel.findOne({
                    _id: machineId,
                    adminId: objectAdminId,
                });
                if (!machine) {
                    throw new Error("Machine not found for this admin");
                }
                const product = await this.nonFuelProductsModel.findOne({
                    _id: productId,
                    adminId: objectAdminId,
                });
                if (!product) {
                    throw new Error("Product not found for this admin");
                }
            }
            const productsToSave = dtos.map((dto) => ({
                ...dto,
                adminId: objectAdminId,
                machineId: new mongoose_2.Types.ObjectId(dto.machineId),
                productId: new mongoose_2.Types.ObjectId(dto.productId),
            }));
            return this.nonFuelSellModel.insertMany(productsToSave);
        }
        catch (error) {
            console.error("SELL ERROR:", error);
            throw error;
        }
    }
    async getProducts(adminId) {
        return this.nonFuelSellModel
            .find({ adminId: new mongoose_2.Types.ObjectId(adminId) })
            .populate("productId")
            .populate("machineId");
    }
    async deleteProduct(productId) {
        return this.nonFuelSellModel.findByIdAndDelete(productId);
    }
};
exports.NonFuelProductSellService = NonFuelProductSellService;
exports.NonFuelProductSellService = NonFuelProductSellService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(non_fuel_product_sell_schema_1.NonFuelSellProduct.name)),
    __param(1, (0, mongoose_1.InjectModel)(machines_schema_1.Machine.name)),
    __param(2, (0, mongoose_1.InjectModel)(non_fuel_product_schema_1.NonFuelProducts.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], NonFuelProductSellService);
