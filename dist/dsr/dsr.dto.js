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
exports.CreateDSRDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class FuelEntryDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FuelEntryDto.prototype, "manualDip", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FuelEntryDto.prototype, "manualDipPic", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FuelEntryDto.prototype, "receipt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FuelEntryDto.prototype, "receiptPic", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FuelEntryDto.prototype, "meterReading", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FuelEntryDto.prototype, "meterReadingPic", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FuelEntryDto.prototype, "pumpTesting", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FuelEntryDto.prototype, "pumpTestingPic", void 0);
class CreateDSRDto {
}
exports.CreateDSRDto = CreateDSRDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateDSRDto.prototype, "pumpId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FuelEntryDto),
    __metadata("design:type", FuelEntryDto)
], CreateDSRDto.prototype, "petrol", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FuelEntryDto),
    __metadata("design:type", FuelEntryDto)
], CreateDSRDto.prototype, "diesel", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => FuelEntryDto),
    __metadata("design:type", FuelEntryDto)
], CreateDSRDto.prototype, "power", void 0);
