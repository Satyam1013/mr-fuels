"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PumpStatusModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_schema_1 = require("../admin/admin.schema");
const tank_details_schema_1 = require("../tank-details/tank-details.schema");
const pump_status_schema_1 = require("./pump-status.schema");
const pump_details_controller_1 = require("./pump-details.controller");
const pump_status_service_1 = require("./pump-status.service");
let PumpStatusModule = class PumpStatusModule {
};
exports.PumpStatusModule = PumpStatusModule;
exports.PumpStatusModule = PumpStatusModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: pump_status_schema_1.PumpStatus.name, schema: pump_status_schema_1.PumpStatusSchema },
                { name: admin_schema_1.Admin.name, schema: admin_schema_1.AdminSchema },
                { name: tank_details_schema_1.TankDetails.name, schema: tank_details_schema_1.TankDetailsSchema },
            ]),
        ],
        controllers: [pump_details_controller_1.PumpStatusController],
        providers: [pump_status_service_1.PumpStatusService],
    })
], PumpStatusModule);
