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
exports.CreateAdminDto = exports.ManagerDetailsDto = exports.ManagerDto = exports.PumpDetailsDto = exports.MachineDetailsDto = exports.MachineDto = exports.NozzleDto = exports.BusinessDetailsDto = exports.FuelDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class FuelDto {
}
exports.FuelDto = FuelDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FuelDto.prototype, "value", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], FuelDto.prototype, "kl", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], FuelDto.prototype, "pdf", void 0);
class BusinessDetailsDto {
}
exports.BusinessDetailsDto = BusinessDetailsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "businessName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "businessEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BusinessDetailsDto.prototype, "businessPhoneNo", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BusinessDetailsDto.prototype, "fuelTypes", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => FuelDto),
    __metadata("design:type", Array)
], BusinessDetailsDto.prototype, "fuels", void 0);
class NozzleDto {
}
exports.NozzleDto = NozzleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], NozzleDto.prototype, "nozzleType", void 0);
class MachineDto {
}
exports.MachineDto = MachineDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], MachineDto.prototype, "machineNo", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], MachineDto.prototype, "nozzleCount", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => NozzleDto),
    __metadata("design:type", Array)
], MachineDto.prototype, "nozzles", void 0);
class MachineDetailsDto {
}
exports.MachineDetailsDto = MachineDetailsDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], MachineDetailsDto.prototype, "numberOfMachines", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => MachineDto),
    __metadata("design:type", Array)
], MachineDetailsDto.prototype, "machines", void 0);
class PumpDetailsDto {
}
exports.PumpDetailsDto = PumpDetailsDto;
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PumpDetailsDto.prototype, "businessUpiApps", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PumpDetailsDto.prototype, "swipeStatement", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PumpDetailsDto.prototype, "bankDeposit", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PumpDetailsDto.prototype, "noOfEmployeeShifts", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], PumpDetailsDto.prototype, "shiftDetails", void 0);
class ManagerDto {
}
exports.ManagerDto = ManagerDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManagerDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManagerDto.prototype, "mobile", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ManagerDto.prototype, "aadhar", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ManagerDto.prototype, "shift", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManagerDto.prototype, "password", void 0);
class ManagerDetailsDto {
}
exports.ManagerDetailsDto = ManagerDetailsDto;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ManagerDetailsDto.prototype, "numberOfManagers", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ManagerDto),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], ManagerDetailsDto.prototype, "managers", void 0);
class CreateAdminDto {
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => BusinessDetailsDto),
    __metadata("design:type", BusinessDetailsDto)
], CreateAdminDto.prototype, "businessDetails", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => MachineDetailsDto),
    __metadata("design:type", MachineDetailsDto)
], CreateAdminDto.prototype, "machineDetails", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PumpDetailsDto),
    __metadata("design:type", PumpDetailsDto)
], CreateAdminDto.prototype, "pumpDetails", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ManagerDetailsDto),
    __metadata("design:type", ManagerDetailsDto)
], CreateAdminDto.prototype, "managerDetails", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "adminPassword", void 0);
//# sourceMappingURL=create-user.dto.js.map