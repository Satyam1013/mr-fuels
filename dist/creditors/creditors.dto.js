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
exports.UpdateCreditorDto = exports.GetCreditorsQueryDto = exports.CreateCreditorDto = exports.CreditRecordDto = void 0;
const class_validator_1 = require("class-validator");
const home_dto_1 = require("../home/home.dto");
class CreditRecordDto {
}
exports.CreditRecordDto = CreditRecordDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreditRecordDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreditRecordDto.prototype, "time", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["credit", "return"]),
    __metadata("design:type", String)
], CreditRecordDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditRecordDto.prototype, "imgUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditRecordDto.prototype, "details", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["cash", "account"]),
    __metadata("design:type", String)
], CreditRecordDto.prototype, "paidType", void 0);
class CreateCreditorDto {
}
exports.CreateCreditorDto = CreateCreditorDto;
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCreditorDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCreditorDto.prototype, "totalCreditGiven", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCreditorDto.prototype, "totalCreditLeft", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateCreditorDto.prototype, "records", void 0);
class GetCreditorsQueryDto {
}
exports.GetCreditorsQueryDto = GetCreditorsQueryDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(home_dto_1.FilterType),
    __metadata("design:type", String)
], GetCreditorsQueryDto.prototype, "filterType", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GetCreditorsQueryDto.prototype, "date", void 0);
class UpdateCreditorDto extends CreateCreditorDto {
}
exports.UpdateCreditorDto = UpdateCreditorDto;
