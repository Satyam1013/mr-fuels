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
exports.CreateHomeDto = exports.FilterType = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var FilterType;
(function (FilterType) {
    FilterType["DAILY"] = "daily";
    FilterType["WEEKLY"] = "weekly";
    FilterType["MONTHLY"] = "monthly";
})(FilterType || (exports.FilterType = FilterType = {}));
class CategoryDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CategoryDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CategoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CategoryDto.prototype, "amount", void 0);
class AmountDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AmountDto.prototype, "ltr", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], AmountDto.prototype, "amount", void 0);
class CreateHomeDto {
}
exports.CreateHomeDto = CreateHomeDto;
__decorate([
    (0, class_validator_1.IsEnum)(FilterType),
    __metadata("design:type", String)
], CreateHomeDto.prototype, "filterType", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHomeDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CategoryDto),
    __metadata("design:type", Array)
], CreateHomeDto.prototype, "categories", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AmountDto),
    __metadata("design:type", AmountDto)
], CreateHomeDto.prototype, "sale", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AmountDto),
    __metadata("design:type", AmountDto)
], CreateHomeDto.prototype, "collection", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AmountDto),
    __metadata("design:type", AmountDto)
], CreateHomeDto.prototype, "collected", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AmountDto),
    __metadata("design:type", AmountDto)
], CreateHomeDto.prototype, "deposited", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AmountDto),
    __metadata("design:type", AmountDto)
], CreateHomeDto.prototype, "diff", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHomeDto.prototype, "salesTarget", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHomeDto.prototype, "saleLastMonth", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateHomeDto.prototype, "expensesLastMonth", void 0);
