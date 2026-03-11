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
exports.NonFuelProductsSchema = exports.NonFuelProducts = exports.NonFuelProductSchema = exports.NonFuelProduct = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let NonFuelProduct = class NonFuelProduct {
};
exports.NonFuelProduct = NonFuelProduct;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NonFuelProduct.prototype, "productName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NonFuelProduct.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NonFuelProduct.prototype, "totalStock", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NonFuelProduct.prototype, "unitType", void 0);
exports.NonFuelProduct = NonFuelProduct = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], NonFuelProduct);
exports.NonFuelProductSchema = mongoose_1.SchemaFactory.createForClass(NonFuelProduct);
let NonFuelProducts = class NonFuelProducts extends mongoose_2.Document {
};
exports.NonFuelProducts = NonFuelProducts;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Admin", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NonFuelProducts.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.NonFuelProductSchema], default: [] }),
    __metadata("design:type", Array)
], NonFuelProducts.prototype, "nonFuelProducts", void 0);
exports.NonFuelProducts = NonFuelProducts = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NonFuelProducts);
exports.NonFuelProductsSchema = mongoose_1.SchemaFactory.createForClass(NonFuelProducts);
