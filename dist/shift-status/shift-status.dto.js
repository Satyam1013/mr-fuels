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
exports.CreateShiftStatusDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const shift_status_enum_1 = require("./shift-status.enum");
const admin_enum_1 = require("../admin/admin.enum");
class ShiftDto {
}
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ShiftDto.prototype, "shiftNumber", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShiftDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShiftDto.prototype, "startTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ShiftDto.prototype, "endTime", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(shift_status_enum_1.ShiftStatusEnum),
    __metadata("design:type", String)
], ShiftDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], ShiftDto.prototype, "closedBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(admin_enum_1.Role),
    __metadata("design:type", String)
], ShiftDto.prototype, "closedByModel", void 0);
class CreateShiftStatusDto {
}
exports.CreateShiftStatusDto = CreateShiftStatusDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShiftStatusDto.prototype, "date", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateShiftStatusDto.prototype, "totalShifts", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ShiftDto),
    __metadata("design:type", ShiftDto)
], CreateShiftStatusDto.prototype, "currentShift", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ShiftDto),
    __metadata("design:type", Array)
], CreateShiftStatusDto.prototype, "shifts", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateShiftStatusDto.prototype, "dailyClose", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(shift_status_enum_1.PumpStatusEnum),
    __metadata("design:type", String)
], CreateShiftStatusDto.prototype, "pumpStatus", void 0);
