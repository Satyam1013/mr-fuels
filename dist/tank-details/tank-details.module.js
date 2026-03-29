"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TankModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const tank_details_schema_1 = require("./tank-details.schema");
const tank_details_controller_1 = require("./tank-details.controller");
const tank_details_service_1 = require("./tank-details.service");
const fuel_product_schema_1 = require("../fuel-product/fuel-product.schema");
let TankModule = class TankModule {
};
exports.TankModule = TankModule;
exports.TankModule = TankModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                {
                    name: tank_details_schema_1.TankDetails.name,
                    schema: tank_details_schema_1.TankDetailsSchema,
                },
                { name: fuel_product_schema_1.FuelProductDetails.name, schema: fuel_product_schema_1.FuelProductDetailsSchema },
            ]),
        ],
        controllers: [tank_details_controller_1.TankController],
        providers: [tank_details_service_1.TankService],
        exports: [tank_details_service_1.TankService],
    })
], TankModule);
