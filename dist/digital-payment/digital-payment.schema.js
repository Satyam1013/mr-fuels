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
exports.DigitalPaymentSchema = exports.DigitalPayment = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let UpiPayment = class UpiPayment {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], UpiPayment.prototype, "appName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], UpiPayment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UpiPayment.prototype, "attachmentName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], UpiPayment.prototype, "attachmentUri", void 0);
UpiPayment = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], UpiPayment);
let PosPayment = class PosPayment {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PosPayment.prototype, "machineName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PosPayment.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PosPayment.prototype, "attachmentName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PosPayment.prototype, "attachmentUri", void 0);
PosPayment = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PosPayment);
let DigitalPayment = class DigitalPayment extends mongoose_2.Document {
};
exports.DigitalPayment = DigitalPayment;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DigitalPayment.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], DigitalPayment.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DigitalPayment.prototype, "shiftId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], DigitalPayment.prototype, "shiftName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], DigitalPayment.prototype, "shiftNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Machine", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], DigitalPayment.prototype, "machineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DigitalPayment.prototype, "nozzleNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [UpiPayment], default: [] }),
    __metadata("design:type", Array)
], DigitalPayment.prototype, "upiPayments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [PosPayment], default: [] }),
    __metadata("design:type", Array)
], DigitalPayment.prototype, "posPayments", void 0);
exports.DigitalPayment = DigitalPayment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DigitalPayment);
exports.DigitalPaymentSchema = mongoose_1.SchemaFactory.createForClass(DigitalPayment);
