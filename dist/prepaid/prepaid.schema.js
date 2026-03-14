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
exports.PrepaidSchema = exports.Prepaid = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const creditors_enum_1 = require("../creditors/creditors.enum");
let Prepaid = class Prepaid extends mongoose_2.Document {
};
exports.Prepaid = Prepaid;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Prepaid.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Customer", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Prepaid.prototype, "customerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Prepaid.prototype, "partyName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Prepaid.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Prepaid.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Prepaid.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Prepaid.prototype, "shiftNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: creditors_enum_1.CreditBy, required: true }),
    __metadata("design:type", String)
], Prepaid.prototype, "creditBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Prepaid.prototype, "narration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Prepaid.prototype, "photoUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Machine", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Prepaid.prototype, "machineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Prepaid.prototype, "nozzleNumber", void 0);
exports.Prepaid = Prepaid = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Prepaid);
exports.PrepaidSchema = mongoose_1.SchemaFactory.createForClass(Prepaid);
