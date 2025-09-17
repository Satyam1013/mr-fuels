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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const attendance_schema_1 = require("./attendance.schema");
const date_1 = require("../utils/date");
const admin_schema_1 = require("../admin/admin.schema");
const attendance_dto_1 = require("./attendance.dto");
let AttendanceService = class AttendanceService {
    constructor(attendanceModel, adminModel) {
        this.attendanceModel = attendanceModel;
        this.adminModel = adminModel;
    }
    async getEmpData(pumpId, role, date, mode = "day") {
        // 1. Calculate date range
        const { startDate, endDate } = (0, date_1.getDateRange)(mode.toUpperCase(), date);
        // 2. Get admin with managers + staff
        const admin = await this.adminModel.findById(pumpId).lean();
        if (!admin)
            throw new common_1.NotFoundException("Pump not found");
        let employees = [];
        if (role === "admin") {
            employees = [
                ...admin.managers,
                ...admin.staff,
            ];
        }
        else {
            employees = admin.staff;
        }
        // 3. Fetch attendance records
        const records = await this.attendanceModel
            .find({
            pumpId,
            date: { $gte: startDate, $lte: endDate },
        })
            .lean();
        // 4. Build a lookup Map for fast access
        const recordMap = new Map();
        for (const r of records) {
            const key = `${r.userId.toString()}-${new Date(r.date).toDateString()}`;
            recordMap.set(key, r);
        }
        // 5. Build empData
        const empData = employees.map((emp) => {
            const attendance = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const empId = emp._id.toString();
                const key = `${empId}-${d.toDateString()}`;
                const rec = recordMap.get(key);
                attendance.push({
                    day: d.getDate(),
                    status: rec?.status ?? attendance_dto_1.AttendanceStatus.ABSENT, // default absent
                });
            }
            return {
                name: emp.name,
                id: emp._id,
                attendance,
                salary: emp.salary ?? 0,
                salaryType: emp.salaryType ?? "N/A",
                salaryPending: emp.salaryPending ?? false,
                credit: emp.credit ?? 0,
                creditLeft: emp.creditLeft ?? 0,
                paidLeave: emp.paidLeave ?? false,
                dateJoined: emp.dateJoined ?? null,
                role: emp.role ?? "staff",
                shift: emp.shift ?? 1,
                document: typeof emp.document === "object" && emp.document !== null
                    ? emp.document
                    : null,
                pendingSalaryRecords: emp.pendingSalaryRecords || [],
            };
        });
        // 6. Compute summary
        const summary = {
            totalSalaryDue: empData.reduce((s, e) => s + (e.salaryPending ? e.salary : 0), 0),
            totalSalaryGiven: empData.reduce((s, e) => s + (e.salaryPending ? 0 : e.salary), 0),
            totalAdvanceTaken: empData.reduce((s, e) => s + (e.credit || 0), 0),
            totalShortageGiven: empData.reduce((s, e) => s + (e.creditLeft || 0), 0),
        };
        return { empData: [{ date, emp: empData, summary }], summary };
    }
    async updateAttendance(pumpId, empId, date, status) {
        const normalizedDate = new Date(date);
        const existing = await this.attendanceModel.findOne({
            pumpId,
            userId: empId,
            date: normalizedDate,
        });
        if (existing) {
            existing.status = status;
            await existing.save();
        }
        else {
            await this.attendanceModel.create({
                pumpId,
                userId: empId,
                date: normalizedDate,
                status,
            });
        }
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(attendance_schema_1.Attendance.name)),
    __param(1, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AttendanceService);
