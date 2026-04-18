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
exports.BankDepositSchema = exports.BankDeposit = exports.DepositByEnum = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var DepositByEnum;
(function (DepositByEnum) {
    DepositByEnum["OWNER"] = "owner";
    DepositByEnum["MANAGER"] = "manager";
    DepositByEnum["STAFF"] = "staff";
})(DepositByEnum || (exports.DepositByEnum = DepositByEnum = {}));
let BankDeposit = class BankDeposit extends mongoose_2.Document {
};
exports.BankDeposit = BankDeposit;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BankDeposit.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BankDeposit.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], BankDeposit.prototype, "shiftNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], BankDeposit.prototype, "totalDepositAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], BankDeposit.prototype, "remainingAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], BankDeposit.prototype, "pumpCash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BankDeposit.prototype, "additionalCash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: DepositByEnum, required: true }),
    __metadata("design:type", String)
], BankDeposit.prototype, "depositBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BankDeposit.prototype, "depositorName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Staff", default: null }),
    __metadata("design:type", Object)
], BankDeposit.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BankDeposit.prototype, "isLatest", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "BankDeposit", default: null }),
    __metadata("design:type", Object)
], BankDeposit.prototype, "previousEntryId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "" }),
    __metadata("design:type", String)
], BankDeposit.prototype, "remarks", void 0);
exports.BankDeposit = BankDeposit = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BankDeposit);
exports.BankDepositSchema = mongoose_1.SchemaFactory.createForClass(BankDeposit);
// Compound index — date + shift ke saare docs quickly milein
exports.BankDepositSchema.index({ adminId: 1, date: 1, shiftNumber: 1 });
