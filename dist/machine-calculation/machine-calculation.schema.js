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
exports.MachineCalculationSchema = exports.MachineCalculation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const machine_calculation_enum_1 = require("./machine-calculation.enum");
let NozzleCalculation = class NozzleCalculation {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NozzleCalculation.prototype, "nozzleName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "nozzleNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NozzleCalculation.prototype, "fuelType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "lastReading", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "currentReading", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "testingLiters", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "faultTestingLiters", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "pricePerLiter", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "salesLiters", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "upiAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleCalculation.prototype, "posAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Staff" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NozzleCalculation.prototype, "staffId", void 0);
NozzleCalculation = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], NozzleCalculation);
let MachineCalculation = class MachineCalculation extends mongoose_2.Document {
};
exports.MachineCalculation = MachineCalculation;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], MachineCalculation.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Machine", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], MachineCalculation.prototype, "machineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], MachineCalculation.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MachineCalculation.prototype, "shiftNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [NozzleCalculation], default: [] }),
    __metadata("design:type", Array)
], MachineCalculation.prototype, "nozzles", void 0);
exports.MachineCalculation = MachineCalculation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], MachineCalculation);
exports.MachineCalculationSchema = mongoose_1.SchemaFactory.createForClass(MachineCalculation);
