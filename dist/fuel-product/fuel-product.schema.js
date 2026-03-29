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
exports.FuelProductDetailsSchema = exports.FuelProductDetails = exports.FuelProductDetail = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fuel_type_enum_1 = require("../common/enums/fuel-type.enum");
let FuelProductDetail = class FuelProductDetail {
};
exports.FuelProductDetail = FuelProductDetail;
__decorate([
    (0, mongoose_1.Prop)({ enum: fuel_type_enum_1.FuelType, required: true }),
    __metadata("design:type", String)
], FuelProductDetail.prototype, "fuelType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FuelProductDetail.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], FuelProductDetail.prototype, "oldPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], FuelProductDetail.prototype, "purchasingPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], FuelProductDetail.prototype, "updatedPriceFrom", void 0);
exports.FuelProductDetail = FuelProductDetail = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], FuelProductDetail);
let FuelProductDetails = class FuelProductDetails extends mongoose_2.Document {
};
exports.FuelProductDetails = FuelProductDetails;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: "Admin",
        required: true,
        unique: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FuelProductDetails.prototype, "adminId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [FuelProductDetail], default: [] }),
    __metadata("design:type", Array)
], FuelProductDetails.prototype, "products", void 0);
exports.FuelProductDetails = FuelProductDetails = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], FuelProductDetails);
exports.FuelProductDetailsSchema = mongoose_1.SchemaFactory.createForClass(FuelProductDetails);
