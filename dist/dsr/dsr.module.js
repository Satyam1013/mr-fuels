"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DSRModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const dsr_schema_1 = require("./dsr.schema");
const dsr_controller_1 = require("./dsr.controller");
const dsr_service_1 = require("./dsr.service");
let DSRModule = class DSRModule {
};
exports.DSRModule = DSRModule;
exports.DSRModule = DSRModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: dsr_schema_1.DSR.name, schema: dsr_schema_1.DSRSchema }])],
        providers: [dsr_service_1.DSRService],
        controllers: [dsr_controller_1.DSRController],
        exports: [mongoose_1.MongooseModule],
    })
], DSRModule);
