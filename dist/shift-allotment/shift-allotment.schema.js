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
exports.ShiftAllotmentSchema = exports.ShiftAllotment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let NozzleAllotment = class NozzleAllotment {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NozzleAllotment.prototype, "nozzleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Staff", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NozzleAllotment.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ["Active", "Inactive"], default: "Active" }),
    __metadata("design:type", String)
], NozzleAllotment.prototype, "nozzleStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], NozzleAllotment.prototype, "inactiveStatus", void 0);
NozzleAllotment = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], NozzleAllotment);
const NozzleAllotmentSchema = mongoose_1.SchemaFactory.createForClass(NozzleAllotment);
let MachineAllotment = class MachineAllotment {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MachineAllotment.prototype, "machineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [NozzleAllotmentSchema], default: [] }),
    __metadata("design:type", Array)
], MachineAllotment.prototype, "nozzles", void 0);
MachineAllotment = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], MachineAllotment);
const MachineAllotmentSchema = mongoose_1.SchemaFactory.createForClass(MachineAllotment);
let ShiftAllotment = class ShiftAllotment extends mongoose_2.Document {
};
exports.ShiftAllotment = ShiftAllotment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ShiftAllotment.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ShiftAllotment.prototype, "shiftId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: "Manager" }], default: [] }),
    __metadata("design:type", Array)
], ShiftAllotment.prototype, "managers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [MachineAllotmentSchema], default: [] }),
    __metadata("design:type", Array)
], ShiftAllotment.prototype, "machines", void 0);
exports.ShiftAllotment = ShiftAllotment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ShiftAllotment);
exports.ShiftAllotmentSchema = mongoose_1.SchemaFactory.createForClass(ShiftAllotment);
exports.ShiftAllotmentSchema.index({ adminId: 1, shiftId: 1 }, { unique: true });
