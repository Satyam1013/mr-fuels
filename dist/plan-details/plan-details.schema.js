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
let Plan = class Plan {
};
exports.Plan = Plan;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Plan.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ["pro", "premium"] }),
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
        type: Object,
        required: true,
    }),
    __metadata("design:type", Object)
], Plan.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        required: true,
    }),
    __metadata("design:type", Object)
], Plan.prototype, "pricing", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        required: true,
    }),
    __metadata("design:type", Object)
], Plan.prototype, "trial", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Plan.prototype, "features", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {},
    }),
    __metadata("design:type", Object)
], Plan.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Object,
        default: {},
    }),
    __metadata("design:type", Object)
], Plan.prototype, "ui", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: ["active", "inactive"], default: "active" }),
    __metadata("design:type", String)
], Plan.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Plan.prototype, "createdAt", void 0);
exports.Plan = Plan = __decorate([
    (0, mongoose_1.Schema)()
], Plan);
exports.PlanSchema = mongoose_1.SchemaFactory.createForClass(Plan);
