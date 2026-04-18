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
exports.UpdateBankDepositDto = exports.CreateBankDepositDto = void 0;
const class_validator_1 = require("class-validator");
const bank_deposit_schema_1 = require("./bank-deposit.schema");
const mapped_types_1 = require("@nestjs/mapped-types");
class CreateBankDepositDto {
}
exports.CreateBankDepositDto = CreateBankDepositDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankDepositDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBankDepositDto.prototype, "shiftNumber", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBankDepositDto.prototype, "totalDepositAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBankDepositDto.prototype, "remainingAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBankDepositDto.prototype, "pumpCash", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateBankDepositDto.prototype, "additionalCash", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(bank_deposit_schema_1.DepositByEnum),
    __metadata("design:type", String)
], CreateBankDepositDto.prototype, "depositBy", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankDepositDto.prototype, "depositorName", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((o) => o.depositBy === bank_deposit_schema_1.DepositByEnum.STAFF),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBankDepositDto.prototype, "staffId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateBankDepositDto.prototype, "remarks", void 0);
class UpdateBankDepositDto extends (0, mapped_types_1.PartialType)(CreateBankDepositDto) {
}
exports.UpdateBankDepositDto = UpdateBankDepositDto;
