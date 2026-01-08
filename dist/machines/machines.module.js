"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const machines_schema_1 = require("./machines.schema");
const machines_service_1 = require("./machines.service");
const machines_controller_1 = require("./machines.controller");
let MachineModule = class MachineModule {
};
exports.MachineModule = MachineModule;
exports.MachineModule = MachineModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: machines_schema_1.Machine.name, schema: machines_schema_1.MachineSchema }]),
        ],
        providers: [machines_service_1.MachineService],
        controllers: [machines_controller_1.MachineController],
    })
], MachineModule);
