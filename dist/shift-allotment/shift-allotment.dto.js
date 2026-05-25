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
exports.UpdateShiftAllotmentDto = exports.CreateShiftAllotmentDto = exports.MachineAllotmentDto = exports.NozzleAllotmentDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class NozzleAllotmentDto {
}
exports.NozzleAllotmentDto = NozzleAllotmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NozzleAllotmentDto.prototype, "nozzleId", void 0);
__decorate([
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], NozzleAllotmentDto.prototype, "staffId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(["Active", "Inactive"]),
    __metadata("design:type", String)
], NozzleAllotmentDto.prototype, "nozzleStatus", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NozzleAllotmentDto.prototype, "inactiveStatus", void 0);
class MachineAllotmentDto {
}
exports.MachineAllotmentDto = MachineAllotmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], MachineAllotmentDto.prototype, "machineId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => NozzleAllotmentDto),
    __metadata("design:type", Array)
], MachineAllotmentDto.prototype, "nozzles", void 0);
class CreateShiftAllotmentDto {
}
exports.CreateShiftAllotmentDto = CreateShiftAllotmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateShiftAllotmentDto.prototype, "shiftId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsMongoId)({ each: true }),
    __metadata("design:type", Array)
], CreateShiftAllotmentDto.prototype, "managers", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MachineAllotmentDto),
    __metadata("design:type", Array)
], CreateShiftAllotmentDto.prototype, "machines", void 0);
class UpdateShiftAllotmentDto extends (0, mapped_types_1.PartialType)(CreateShiftAllotmentDto) {
}
exports.UpdateShiftAllotmentDto = UpdateShiftAllotmentDto;
