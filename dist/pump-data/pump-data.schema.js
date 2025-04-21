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
exports.FuelPriceSchema = exports.FuelPrice = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let FuelPrice = class FuelPrice {
};
exports.FuelPrice = FuelPrice;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FuelPrice.prototype, "petrol", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FuelPrice.prototype, "diesel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FuelPrice.prototype, "power", void 0);
exports.FuelPrice = FuelPrice = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], FuelPrice);
exports.FuelPriceSchema = mongoose_1.SchemaFactory.createForClass(FuelPrice);
//# sourceMappingURL=pump-data.schema.js.map