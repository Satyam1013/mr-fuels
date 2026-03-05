"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonFuelProductModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const non_fuel_product_controller_1 = require("./non-fuel-product.controller");
const non_fuel_product_service_1 = require("./non-fuel-product.service");
const non_fuel_product_schema_1 = require("./non-fuel-product.schema");
let NonFuelProductModule = class NonFuelProductModule {
};
exports.NonFuelProductModule = NonFuelProductModule;
exports.NonFuelProductModule = NonFuelProductModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: non_fuel_product_schema_1.NonFuelProduct.name, schema: non_fuel_product_schema_1.NonFuelProductSchema },
            ]),
        ],
        controllers: [non_fuel_product_controller_1.NonFuelProductController],
        providers: [non_fuel_product_service_1.NonFuelProductService],
    })
], NonFuelProductModule);
