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
exports.UpdateFuelProductsDto = exports.UpdateFuelProductDto = exports.CreateFuelProductsDto = exports.CreateFuelProductDto = void 0;
const class_validator_1 = require("class-validator");
const fuel_type_enum_1 = require("../common/enums/fuel-type.enum");
const class_transformer_1 = require("class-transformer");
class CreateFuelProductDto {
}
exports.CreateFuelProductDto = CreateFuelProductDto;
__decorate([
    (0, class_validator_1.IsEnum)(fuel_type_enum_1.FuelType),
    __metadata("design:type", String)
], CreateFuelProductDto.prototype, "fuelType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFuelProductDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFuelProductDto.prototype, "oldPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateFuelProductDto.prototype, "purchasingPrice", void 0);
class CreateFuelProductsDto {
}
exports.CreateFuelProductsDto = CreateFuelProductsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateFuelProductDto),
    __metadata("design:type", Array)
], CreateFuelProductsDto.prototype, "products", void 0);
class UpdateFuelProductDto {
}
exports.UpdateFuelProductDto = UpdateFuelProductDto;
__decorate([
    (0, class_validator_1.IsEnum)(fuel_type_enum_1.FuelType),
    __metadata("design:type", String)
], UpdateFuelProductDto.prototype, "fuelType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateFuelProductDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], UpdateFuelProductDto.prototype, "purchasingPrice", void 0);
class UpdateFuelProductsDto {
}
exports.UpdateFuelProductsDto = UpdateFuelProductsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => UpdateFuelProductDto),
    __metadata("design:type", Array)
], UpdateFuelProductsDto.prototype, "products", void 0);
