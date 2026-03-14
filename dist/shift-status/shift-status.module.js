"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftStatusModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const shift_status_schema_1 = require("./shift-status.schema");
const shift_status_service_1 = require("./shift-status.service");
const shift_status_controller_1 = require("./shift-status.controller");
let ShiftStatusModule = class ShiftStatusModule {
};
exports.ShiftStatusModule = ShiftStatusModule;
exports.ShiftStatusModule = ShiftStatusModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: shift_status_schema_1.ShiftStatus.name, schema: shift_status_schema_1.ShiftStatusSchema },
            ]),
        ],
        controllers: [shift_status_controller_1.ShiftStatusController],
        providers: [shift_status_service_1.ShiftStatusService],
    })
], ShiftStatusModule);
