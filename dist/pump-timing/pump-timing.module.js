"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpTimingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const pump_timing_controller_1 = require("./pump-timing.controller");
const pump_timing_service_1 = require("./pump-timing.service");
const pump_timing_schema_1 = require("./pump-timing.schema");
let PumpTimingModule = class PumpTimingModule {
};
exports.PumpTimingModule = PumpTimingModule;
exports.PumpTimingModule = PumpTimingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: pump_timing_schema_1.PumpTiming.name, schema: pump_timing_schema_1.PumpTimingSchema },
            ]),
        ],
        controllers: [pump_timing_controller_1.PumpTimingController],
        providers: [pump_timing_service_1.PumpTimingService],
        exports: [pump_timing_service_1.PumpTimingService],
    })
], PumpTimingModule);
