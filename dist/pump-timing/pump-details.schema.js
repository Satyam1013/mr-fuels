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
exports.PumpTimingSchema = exports.PumpTiming = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TimeRange = class TimeRange {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TimeRange.prototype, "start", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TimeRange.prototype, "end", void 0);
TimeRange = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], TimeRange);
let PumpTiming = class PumpTiming extends mongoose_2.Document {
};
exports.PumpTiming = PumpTiming;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "Admin",
        required: true,
        index: true,
        unique: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PumpTiming.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PumpTiming.prototype, "dailyCloseReportTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], PumpTiming.prototype, "is24Hour", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PumpTiming.prototype, "pumpHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: TimeRange, required: true }),
    __metadata("design:type", TimeRange)
], PumpTiming.prototype, "pumpTime", void 0);
exports.PumpTiming = PumpTiming = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PumpTiming);
exports.PumpTimingSchema = mongoose_1.SchemaFactory.createForClass(PumpTiming);
