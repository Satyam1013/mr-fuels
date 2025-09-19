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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const attendance_service_1 = require("./attendance.service");
const get_user_decoration_1 = require("../auth/get-user.decoration");
const attendance_dto_1 = require("./attendance.dto");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async getEmpAttendance(pumpId, role, date, mode = "day") {
        return this.attendanceService.getEmpData(pumpId, role, date, mode);
    }
    async updateAttendance(empId, day, dto, pumpId) {
        await this.attendanceService.updateAttendance(pumpId, empId, dto.role, day, // ✅ always take from param
        dto.status);
        return { success: true };
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Get)("emp-data"),
    __param(0, (0, get_user_decoration_1.GetUser)("pumpId")),
    __param(1, (0, get_user_decoration_1.GetUser)("role")),
    __param(2, (0, common_1.Query)("date")),
    __param(3, (0, common_1.Query)("mode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getEmpAttendance", null);
__decorate([
    (0, common_1.Put)("emp/:empId/day/:day"),
    __param(0, (0, common_1.Param)("empId")),
    __param(1, (0, common_1.Param)("day")),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, get_user_decoration_1.GetUser)("pumpId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, attendance_dto_1.UpdateAttendanceDto, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "updateAttendance", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)("attendance"),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
