"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NonFuelProductSellModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const non_fuel_product_sales_controller_1 = require("./non-fuel-product-sales.controller");
const non_fuel_product_sales_service_1 = require("./non-fuel-product-sales.service");
const non_fuel_product_sales_schema_1 = require("./non-fuel-product-sales.schema");
const machines_schema_1 = require("../machines/machines.schema");
const non_fuel_product_schema_1 = require("../non-fuel-product/non-fuel-product.schema");
let NonFuelProductSellModule = class NonFuelProductSellModule {
};
exports.NonFuelProductSellModule = NonFuelProductSellModule;
exports.NonFuelProductSellModule = NonFuelProductSellModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: non_fuel_product_sales_schema_1.NonFuelSellProduct.name, schema: non_fuel_product_sales_schema_1.NonFuelSellProductSchema },
                { name: machines_schema_1.Machine.name, schema: machines_schema_1.MachineSchema },
                { name: non_fuel_product_schema_1.NonFuelProducts.name, schema: non_fuel_product_schema_1.NonFuelProductsSchema },
            ]),
        ],
        controllers: [non_fuel_product_sales_controller_1.NonFuelProductSellController],
        providers: [non_fuel_product_sales_service_1.NonFuelProductSellService],
    })
], NonFuelProductSellModule);
