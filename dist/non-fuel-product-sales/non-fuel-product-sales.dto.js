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
exports.CreateNonFuelSaleProductsDto = exports.CreateNonFuelSaleProductDto = void 0;
const class_validator_1 = require("class-validator");
const creditors_enum_1 = require("../creditors/creditors.enum");
const class_transformer_1 = require("class-transformer");
class CreateNonFuelSaleProductDto {
}
exports.CreateNonFuelSaleProductDto = CreateNonFuelSaleProductDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateNonFuelSaleProductDto.prototype, "machineId", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateNonFuelSaleProductDto.prototype, "productId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNonFuelSaleProductDto.prototype, "nozzleNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNonFuelSaleProductDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNonFuelSaleProductDto.prototype, "pricePerUnit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNonFuelSaleProductDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(creditors_enum_1.CreditBy),
    __metadata("design:type", String)
], CreateNonFuelSaleProductDto.prototype, "creditBy", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateNonFuelSaleProductDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateNonFuelSaleProductDto.prototype, "shiftNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNonFuelSaleProductDto.prototype, "narration", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNonFuelSaleProductDto.prototype, "photoUrl", void 0);
class CreateNonFuelSaleProductsDto {
}
exports.CreateNonFuelSaleProductsDto = CreateNonFuelSaleProductsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateNonFuelSaleProductDto),
    __metadata("design:type", Array)
], CreateNonFuelSaleProductsDto.prototype, "products", void 0);
