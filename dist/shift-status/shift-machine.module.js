"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftMachineModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const shift_machine_controller_1 = require("./shift-machine.controller");
const shift_machine_service_1 = require("./shift-machine.service");
const shift_machine_schema_1 = require("./shift-machine.schema");
const machines_schema_1 = require("../machines/machines.schema");
let ShiftMachineModule = class ShiftMachineModule {
};
exports.ShiftMachineModule = ShiftMachineModule;
exports.ShiftMachineModule = ShiftMachineModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: shift_machine_schema_1.ShiftMachineEntry.name, schema: shift_machine_schema_1.ShiftMachineSchema },
                { name: machines_schema_1.Machine.name, schema: machines_schema_1.MachineSchema },
            ]),
        ],
        controllers: [shift_machine_controller_1.ShiftMachineController],
        providers: [shift_machine_service_1.ShiftMachineService],
    })
], ShiftMachineModule);
