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
exports.GetNozzleDetailsDto = exports.CreateMachineCalculationDto = exports.NozzleDto = exports.StaffAssignmentDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class StaffAssignmentDto {
}
exports.StaffAssignmentDto = StaffAssignmentDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], StaffAssignmentDto.prototype, "staffId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], StaffAssignmentDto.prototype, "assignedNozzleNumbers", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StaffAssignmentDto.prototype, "upiAmount", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StaffAssignmentDto.prototype, "posAmount", void 0);
class NozzleDto {
}
exports.NozzleDto = NozzleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NozzleDto.prototype, "nozzleName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], NozzleDto.prototype, "nozzleNumber", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], NozzleDto.prototype, "fuelProductId", void 0);
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
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => NozzleDto),
    __metadata("design:type", Array)
], CreateMachineCalculationDto.prototype, "nozzles", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StaffAssignmentDto),
    __metadata("design:type", Array)
], CreateMachineCalculationDto.prototype, "staff", void 0);
class GetNozzleDetailsDto {
}
exports.GetNozzleDetailsDto = GetNozzleDetailsDto;
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], GetNozzleDetailsDto.prototype, "machineId", void 0);
