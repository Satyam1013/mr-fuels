"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpDataModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const pump_data_service_1 = require("./pump-data.service");
const pump_data_controller_1 = require("./pump-data.controller");
const machine_schema_1 = require("../machine/machine.schema");
const fuel_price_schema_1 = require("../fuel-price/fuel-price.schema");
let PumpDataModule = class PumpDataModule {
};
exports.PumpDataModule = PumpDataModule;
exports.PumpDataModule = PumpDataModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: machine_schema_1.Machine.name, schema: machine_schema_1.MachineSchema },
                { name: fuel_price_schema_1.FuelPrice.name, schema: fuel_price_schema_1.FuelPriceSchema },
            ]),
        ],
        controllers: [pump_data_controller_1.PumpDataController],
        providers: [pump_data_service_1.PumpDataService],
    })
], PumpDataModule);
//# sourceMappingURL=pump-data.module.js.map