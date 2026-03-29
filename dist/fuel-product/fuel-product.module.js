"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelProductModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const fuel_product_service_1 = require("./fuel-product.service");
const fuel_product_controller_1 = require("./fuel-product.controller");
const fuel_product_schema_1 = require("./fuel-product.schema");
let FuelProductModule = class FuelProductModule {
};
exports.FuelProductModule = FuelProductModule;
exports.FuelProductModule = FuelProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: fuel_product_schema_1.FuelProductDetails.name, schema: fuel_product_schema_1.FuelProductDetailsSchema },
            ]),
        ],
        controllers: [fuel_product_controller_1.FuelProductController],
        providers: [fuel_product_service_1.FuelProductService],
        exports: [fuel_product_service_1.FuelProductService],
    })
], FuelProductModule);
