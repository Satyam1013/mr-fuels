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
exports.PumpStatusSchema = exports.PumpStatus = void 0;
// pump-status.schema.ts
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let PumpStatus = class PumpStatus {
};
exports.PumpStatus = PumpStatus;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PumpStatus.prototype, "machineNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PumpStatus.prototype, "nozzleNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PumpStatus.prototype, "fuelType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ["active", "inactive", "maintenance"],
        default: "active",
    }),
    __metadata("design:type", String)
], PumpStatus.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Staff", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PumpStatus.prototype, "handledBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PumpStatus.prototype, "adminId", void 0);
exports.PumpStatus = PumpStatus = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], PumpStatus);
exports.PumpStatusSchema = mongoose_1.SchemaFactory.createForClass(PumpStatus);
