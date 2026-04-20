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
exports.NonFuelSaleProductSchema = exports.NonFuelSaleProduct = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const creditors_enum_1 = require("../creditors/creditors.enum");
let NonFuelSaleProduct = class NonFuelSaleProduct extends mongoose_2.Document {
};
exports.NonFuelSaleProduct = NonFuelSaleProduct;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NonFuelSaleProduct.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Machine", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NonFuelSaleProduct.prototype, "machineId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "NonFuelProducts", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NonFuelSaleProduct.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NonFuelSaleProduct.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NonFuelSaleProduct.prototype, "pricePerUnit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NonFuelSaleProduct.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ enum: creditors_enum_1.CreditBy, required: true }),
    __metadata("design:type", String)
], NonFuelSaleProduct.prototype, "creditBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], NonFuelSaleProduct.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NonFuelSaleProduct.prototype, "shiftNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NonFuelSaleProduct.prototype, "narration", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NonFuelSaleProduct.prototype, "photoUrl", void 0);
exports.NonFuelSaleProduct = NonFuelSaleProduct = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NonFuelSaleProduct);
exports.NonFuelSaleProductSchema = mongoose_1.SchemaFactory.createForClass(NonFuelSaleProduct);
