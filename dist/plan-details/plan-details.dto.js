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
exports.PlanDetailsDto = exports.UiDto = exports.TagsDto = exports.TrialDto = exports.PricingDto = exports.DurationDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class DurationDto {
}
exports.DurationDto = DurationDto;
__decorate([
    (0, class_validator_1.IsEnum)(["trial", "monthly", "yearly"]),
    __metadata("design:type", String)
], DurationDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], DurationDto.prototype, "months", void 0);
class PricingDto {
}
exports.PricingDto = PricingDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "originalPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PricingDto.prototype, "finalPrice", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PricingDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PricingDto.prototype, "isFree", void 0);
class TrialDto {
}
exports.TrialDto = TrialDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TrialDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TrialDto.prototype, "trialDays", void 0);
class TagsDto {
}
exports.TagsDto = TagsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TagsDto.prototype, "mostPopular", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TagsDto.prototype, "discounted", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TagsDto.prototype, "freeTrial", void 0);
class UiDto {
}
exports.UiDto = UiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UiDto.prototype, "badgeText", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UiDto.prototype, "badgeColor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UiDto.prototype, "gradient", void 0);
// Main DTO
class PlanDetailsDto {
}
exports.PlanDetailsDto = PlanDetailsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanDetailsDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["pro", "premium"]),
    __metadata("design:type", String)
], PlanDetailsDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], PlanDetailsDto.prototype, "tier", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PlanDetailsDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => DurationDto),
    __metadata("design:type", DurationDto)
], PlanDetailsDto.prototype, "duration", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PricingDto),
    __metadata("design:type", PricingDto)
], PlanDetailsDto.prototype, "pricing", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TrialDto),
    __metadata("design:type", TrialDto)
], PlanDetailsDto.prototype, "trial", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PlanDetailsDto.prototype, "features", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TagsDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", TagsDto)
], PlanDetailsDto.prototype, "tags", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => UiDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", UiDto)
], PlanDetailsDto.prototype, "ui", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["active", "inactive"]),
    __metadata("design:type", String)
], PlanDetailsDto.prototype, "status", void 0);
