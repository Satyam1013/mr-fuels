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
exports.UpdateReadingDto = exports.UpdateMachineDto = exports.CreateMachineDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const machine_schema_1 = require("./machine.schema");
const class_validator_1 = require("class-validator");
class CreateMachineDto {
}
exports.CreateMachineDto = CreateMachineDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMachineDto.prototype, "machineNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMachineDto.prototype, "nozzleNo", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(machine_schema_1.FuelType),
    __metadata("design:type", String)
], CreateMachineDto.prototype, "fuelType", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMachineDto.prototype, "isActive", void 0);
class UpdateMachineDto extends (0, mapped_types_1.PartialType)(CreateMachineDto) {
}
exports.UpdateMachineDto = UpdateMachineDto;
class UpdateReadingDto {
}
exports.UpdateReadingDto = UpdateReadingDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateReadingDto.prototype, "startDayReading", void 0);
//# sourceMappingURL=machine.dto.js.map