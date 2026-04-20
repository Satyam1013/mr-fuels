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
exports.ShiftMachineSchema = exports.ShiftMachineEntry = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let NozzleReading = class NozzleReading {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NozzleReading.prototype, "nozzleName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NozzleReading.prototype, "fuelType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NozzleReading.prototype, "lastReading", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NozzleReading.prototype, "currentReading", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NozzleReading.prototype, "pricePerLiter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], NozzleReading.prototype, "testingLiters", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], NozzleReading.prototype, "faultTestingLiters", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NozzleReading.prototype, "narration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleReading.prototype, "totalSaleLiters", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NozzleReading.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NozzleReading.prototype, "readingPhotoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NozzleReading.prototype, "testingPhotoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NozzleReading.prototype, "faultPhotoUrl", void 0);
NozzleReading = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], NozzleReading);
let ShiftMachineEntry = class ShiftMachineEntry extends mongoose_2.Document {
};
exports.ShiftMachineEntry = ShiftMachineEntry;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ShiftMachineEntry.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ShiftMachineEntry.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ShiftMachineEntry.prototype, "shiftId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ShiftMachineEntry.prototype, "shiftNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Machine", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ShiftMachineEntry.prototype, "machineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [NozzleReading], default: [] }),
    __metadata("design:type", Array)
], ShiftMachineEntry.prototype, "nozzles", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], ShiftMachineEntry.prototype, "totalMachineAmount", void 0);
exports.ShiftMachineEntry = ShiftMachineEntry = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ShiftMachineEntry);
exports.ShiftMachineSchema = mongoose_1.SchemaFactory.createForClass(ShiftMachineEntry);
exports.ShiftMachineSchema.index({ adminId: 1, date: 1, shiftId: 1, machineId: 1 }, { unique: true });
