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
exports.ShiftStatusSchema = exports.ShiftStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_status_enum_1 = require("./shift-status.enum");
let Shift = class Shift {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Shift.prototype, "shiftNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shift.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shift.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Shift.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: shift_status_enum_1.ShiftStatusEnum, default: shift_status_enum_1.ShiftStatusEnum.PENDING }),
    __metadata("design:type", String)
], Shift.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: shift_status_enum_1.ClosedBy }),
    __metadata("design:type", String)
], Shift.prototype, "closedBy", void 0);
Shift = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], Shift);
let ShiftStatus = class ShiftStatus extends mongoose_2.Document {
};
exports.ShiftStatus = ShiftStatus;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ShiftStatus.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ShiftStatus.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ShiftStatus.prototype, "totalShifts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Shift }),
    __metadata("design:type", Shift)
], ShiftStatus.prototype, "currentShift", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Shift] }),
    __metadata("design:type", Array)
], ShiftStatus.prototype, "shifts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ShiftStatus.prototype, "dailyClose", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: shift_status_enum_1.PumpStatusEnum, default: shift_status_enum_1.PumpStatusEnum.OPEN }),
    __metadata("design:type", String)
], ShiftStatus.prototype, "pumpStatus", void 0);
exports.ShiftStatus = ShiftStatus = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ShiftStatus);
exports.ShiftStatusSchema = mongoose_1.SchemaFactory.createForClass(ShiftStatus);
exports.ShiftStatusSchema.index({ adminId: 1, date: 1 }, { unique: true });
