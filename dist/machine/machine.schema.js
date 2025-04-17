"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MachineSchema = exports.Machine = exports.FuelType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var FuelType;
(function (FuelType) {
    FuelType["PETROL"] = "Petrol";
    FuelType["DIESEL"] = "Diesel";
    FuelType["POWER"] = "Power";
})(FuelType || (exports.FuelType = FuelType = {}));
let Machine = class Machine {
};
exports.Machine = Machine;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Machine.prototype, "machineNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Machine.prototype, "nozzleNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: FuelType }),
    __metadata("design:type", String)
], Machine.prototype, "fuelType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                date: { type: Date, required: true },
                reading: { type: Number, required: true },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], Machine.prototype, "readings", void 0);
exports.Machine = Machine = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Machine);
exports.MachineSchema = mongoose_1.SchemaFactory.createForClass(Machine);
//# sourceMappingURL=machine.schema.js.map