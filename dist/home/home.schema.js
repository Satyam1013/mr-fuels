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
exports.HomeSchema = exports.Home = void 0;
// src/home/home.schema.ts
const mongoose_1 = require("@nestjs/mongoose");
const home_dto_1 = require("./home.dto");
let Category = class Category {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Category.prototype, "amount", void 0);
Category = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Category);
const CategorySchema = mongoose_1.SchemaFactory.createForClass(Category);
let Home = class Home {
};
exports.Home = Home;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: home_dto_1.FilterType }),
    __metadata("design:type", String)
], Home.prototype, "filterType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Home.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [CategorySchema], default: [] }),
    __metadata("design:type", Array)
], Home.prototype, "categories", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Home.prototype, "sale", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Home.prototype, "collection", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Home.prototype, "collected", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Home.prototype, "deposited", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, required: true }),
    __metadata("design:type", Object)
], Home.prototype, "diff", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Home.prototype, "salesTarget", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Home.prototype, "saleLastMonth", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Home.prototype, "expensesLastMonth", void 0);
exports.Home = Home = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Home);
exports.HomeSchema = mongoose_1.SchemaFactory.createForClass(Home);
