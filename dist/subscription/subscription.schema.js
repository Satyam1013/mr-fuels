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
exports.SubscriptionSchema = exports.Subscription = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const subscription_enum_1 = require("./subscription.enum");
let Subscription = class Subscription extends mongoose_2.Document {
};
exports.Subscription = Subscription;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Subscription.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Plan", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Subscription.prototype, "planId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: subscription_enum_1.SubscriptionStatus, default: subscription_enum_1.SubscriptionStatus.ACTIVE }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "isTrial", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: null }),
    __metadata("design:type", String)
], Subscription.prototype, "paymentId", void 0);
exports.Subscription = Subscription = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Subscription);
exports.SubscriptionSchema = mongoose_1.SchemaFactory.createForClass(Subscription);
