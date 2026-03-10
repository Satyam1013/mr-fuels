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
exports.CreateMachineCalculationDto = exports.NozzleDto = void 0;
const class_validator_1 = require("class-validator");
class NozzleDto {
}
exports.NozzleDto = NozzleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NozzleDto.prototype, "nozzleName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NozzleDto.prototype, "fuelType", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NozzleDto.prototype, "lastReading", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NozzleDto.prototype, "currentReading", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NozzleDto.prototype, "testingLiters", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NozzleDto.prototype, "faultTestingLiters", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NozzleDto.prototype, "pricePerLiter", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NozzleDto.prototype, "upiAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NozzleDto.prototype, "posAmount", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], NozzleDto.prototype, "staffId", void 0);
class CreateMachineCalculationDto {
}
exports.CreateMachineCalculationDto = CreateMachineCalculationDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateMachineCalculationDto.prototype, "machineId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMachineCalculationDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMachineCalculationDto.prototype, "shiftNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMachineCalculationDto.prototype, "nozzleNumber", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateMachineCalculationDto.prototype, "nozzles", void 0);
