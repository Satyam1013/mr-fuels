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
exports.PlanSchema = exports.Plan = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const plan_details_enums_1 = require("./plan-details.enums");
let Plan = class Plan {
};
exports.Plan = Plan;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Plan.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: plan_details_enums_1.PlanName }),
    __metadata("design:type", String)
], Plan.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Plan.prototype, "tier", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Plan.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        _id: false,
        type: {
            type: { type: String, enum: plan_details_enums_1.DurationType, required: true },
            months: { type: Number, required: true },
        },
    }),
    __metadata("design:type", Object)
], Plan.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        _id: false,
        type: {
            originalPrice: { type: Number, required: true },
            finalPrice: { type: Number, required: true },
            currency: { type: String, enum: plan_details_enums_1.Currency, required: true },
            isFree: { type: Boolean, required: true },
        },
    }),
    __metadata("design:type", Object)
], Plan.prototype, "pricing", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        _id: false,
        type: {
            enabled: { type: Boolean, required: true },
            trialDays: { type: Number },
        },
    }),
    __metadata("design:type", Object)
], Plan.prototype, "trial", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Plan.prototype, "features", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        _id: false,
        type: {
            mostPopular: Boolean,
            discounted: Boolean,
            freeTrial: Boolean,
        },
        default: {},
    }),
    __metadata("design:type", Object)
], Plan.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        _id: false,
        type: {
            badgeText: String,
            badgeColor: String,
            gradient: [String],
        },
        default: {},
    }),
    __metadata("design:type", Object)
], Plan.prototype, "ui", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: plan_details_enums_1.PlanStatus, default: plan_details_enums_1.PlanStatus.ACTIVE }),
    __metadata("design:type", String)
], Plan.prototype, "status", void 0);
exports.Plan = Plan = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Plan);
exports.PlanSchema = mongoose_1.SchemaFactory.createForClass(Plan);
