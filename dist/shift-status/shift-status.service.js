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
exports.ShiftStatusService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shift_status_schema_1 = require("./shift-status.schema");
const pump_details_schema_1 = require("../pump-details/pump-details.schema");
const shift_status_enum_1 = require("./shift-status.enum");
const admin_enum_1 = require("../admin/admin.enum");
let ShiftStatusService = class ShiftStatusService {
    constructor(shiftStatusModel, pumpDetailsModel) {
        this.shiftStatusModel = shiftStatusModel;
        this.pumpDetailsModel = pumpDetailsModel;
    }
    async create(adminId, dto) {
        const existing = await this.shiftStatusModel.findOne({
            adminId,
            date: dto.date,
        });
        if (existing) {
            throw new common_1.BadRequestException("Shift status already created for this date");
        }
        return this.shiftStatusModel.create({
            ...dto,
            adminId,
        });
    }
    buildTemplate(pumpDetails, date, shiftId) {
        return {
            date,
            totalShifts: pumpDetails.numberOfShifts,
            currentShift: {
                shiftId: 1,
                staffId: shiftId,
                name: `Shift 1`,
                startTime: pumpDetails.pumpTime.start,
                endTime: "",
                status: "Active",
            },
            shifts: [],
            dailyProgress: {
                completedShifts: 0,
                pendingShifts: pumpDetails.numberOfShifts,
                overallCompletionPercent: 0,
            },
            dailyClose: false,
            pumpStatus: "open",
        };
    }
    async getByDate(adminId, date) {
        const pumpDetails = await this.pumpDetailsModel.findOne({ adminId }).lean();
        if (!pumpDetails) {
            throw new Error("Pump details not found");
        }
        const today = new Date().toISOString().split("T")[0];
        const requestedDate = date || today;
        const formattedNumberDate = Number(requestedDate.replace(/-/g, "") + "01");
        const reqDateObj = new Date(requestedDate);
        const todayObj = new Date(today);
        // ✅ SAFE helper (FIXED)
        const mapClosedBy = (shift) => {
            const closedBy = shift?.closedBy;
            if (!closedBy)
                return null;
            // ✅ ObjectId case
            if (closedBy instanceof mongoose_2.Types.ObjectId) {
                return {
                    id: closedBy.toString(),
                    name: "",
                    role: shift.closedByModel,
                };
            }
            // ✅ Populated object case
            if (typeof closedBy === "object" && "_id" in closedBy) {
                return {
                    id: closedBy._id?.toString() || null,
                    name: closedBy.name || "",
                    role: shift.closedByModel,
                };
            }
            return null;
        };
        const mapResponse = (data) => {
            const completedShifts = data.shifts.filter((s) => s.status === shift_status_enum_1.ShiftStatusEnum.COMPLETED).length;
            const totalShifts = pumpDetails.numberOfShifts || 0;
            const pendingShifts = totalShifts - completedShifts;
            const percent = totalShifts > 0 ? (completedShifts / totalShifts) * 100 : 0;
            return {
                _id: data._id?.toString(),
                date: data.date,
                totalShifts,
                currentShift: data.currentShift
                    ? {
                        ...data.currentShift,
                        closedBy: mapClosedBy(data.currentShift),
                    }
                    : null,
                shifts: (data.shifts || []).map((s) => ({
                    ...s,
                    closedBy: mapClosedBy(s),
                })),
                dailyProgress: {
                    completedShifts,
                    pendingShifts,
                    overallCompletionPercent: percent,
                },
                dailyClose: data.dailyClose,
                pumpStatus: data.pumpStatus,
            };
        };
        // ----------- EXACT DATA -----------
        const exact = await this.shiftStatusModel
            .findOne({
            adminId,
            date: requestedDate,
        })
            .populate("shifts.closedBy", "name")
            .populate("currentShift.closedBy", "name")
            .lean();
        if (exact) {
            return mapResponse(exact);
        }
        // ----------- LATEST RECORD -----------
        const latest = await this.shiftStatusModel
            .findOne({ adminId })
            .sort({ date: -1 })
            .populate("shifts.closedBy", "name")
            .populate("currentShift.closedBy", "name")
            .lean();
        if (!latest) {
            return this.buildTemplate(pumpDetails, requestedDate, formattedNumberDate);
        }
        const latestDateObj = new Date(latest.date);
        // ----------- FIRST RECORD -----------
        const first = await this.shiftStatusModel
            .findOne({ adminId })
            .sort({ date: 1 })
            .lean();
        if (!first) {
            return this.buildTemplate(pumpDetails, requestedDate, formattedNumberDate);
        }
        const firstDateObj = new Date(first.date);
        if (reqDateObj < firstDateObj) {
            return {
                message: "Selected date does not come in range, please try after the first registered date",
                firstRegisteredDate: first.date,
            };
        }
        // ✅ ----------- PREVIOUS UNFINISHED (FIXED ORDER + SAFE) -----------
        if (!latest.dailyClose && reqDateObj > latestDateObj) {
            return {
                ...mapResponse(latest),
                requestedDate,
                reason: "previous_unfinished_day",
            };
        }
        // ----------- NO DATA FOR PAST / TODAY -----------
        if (reqDateObj <= todayObj) {
            return {
                message: "No data available for this date",
                date: requestedDate,
            };
        }
        // ----------- FUTURE TEMPLATE -----------
        return this.buildTemplate(pumpDetails, requestedDate, formattedNumberDate);
    }
    async update(user, id, dto) {
        const existing = await this.shiftStatusModel.findById(id);
        if (!existing) {
            throw new common_1.NotFoundException("Shift status not found");
        }
        // ❌ Staff not allowed
        if (user.role === admin_enum_1.Role.STAFF) {
            throw new common_1.ForbiddenException("Staff is not allowed to update shift");
        }
        const now = new Date().toISOString();
        // ✅ role for refPath
        const roleModel = user.role === admin_enum_1.Role.ADMIN ? admin_enum_1.Role.ADMIN : admin_enum_1.Role.MANAGER;
        const updatePayload = {};
        // =====================================================
        // ✅ 1. HANDLE SHIFT UPDATE (FULL SAFE)
        // =====================================================
        if (dto.shifts && dto.shifts.length > 0) {
            dto.shifts.forEach((incomingShift) => {
                let index = existing.shifts.findIndex((s) => s.shiftNumber === incomingShift.shiftNumber);
                // 🔥 fallback if corrupted data
                if (index === -1) {
                    index = existing.shifts.findIndex((s) => !s.shiftNumber);
                }
                if (index !== -1) {
                    const oldShift = existing.shifts[index];
                    const updatedStatus = incomingShift.status ?? oldShift.status;
                    existing.shifts[index] = {
                        shiftNumber: incomingShift.shiftNumber || oldShift.shiftNumber,
                        name: oldShift.name ||
                            incomingShift.name ||
                            `Shift ${incomingShift.shiftNumber}`,
                        startTime: incomingShift.startTime ?? oldShift.startTime,
                        endTime: incomingShift.status === shift_status_enum_1.ShiftStatusEnum.COMPLETED
                            ? now
                            : (incomingShift.endTime ?? oldShift.endTime),
                        status: updatedStatus,
                        ...(incomingShift.status === shift_status_enum_1.ShiftStatusEnum.COMPLETED && {
                            closedBy: new mongoose_2.Types.ObjectId(user.adminId || user._id),
                            closedByModel: roleModel,
                        }),
                    };
                }
            });
            updatePayload.shifts = existing.shifts;
        }
        // =====================================================
        // ✅ 2. UPDATE currentShift (SAFE)
        // =====================================================
        const activeShift = existing.shifts.find((s) => s.status === shift_status_enum_1.ShiftStatusEnum.ACTIVE);
        const lastShift = existing.shifts[existing.shifts.length - 1];
        existing.currentShift = activeShift || {
            shiftNumber: lastShift?.shiftNumber,
            name: lastShift?.name || `Shift ${lastShift?.shiftNumber}`,
            status: lastShift?.status,
            startTime: lastShift?.startTime,
            endTime: lastShift?.endTime,
            closedBy: lastShift?.closedBy,
            closedByModel: lastShift?.closedByModel,
        };
        updatePayload.currentShift = existing.currentShift;
        // =====================================================
        // ✅ 3. DAILY CLOSE (FULL SAFE)
        // =====================================================
        if (dto.dailyClose === true) {
            if (existing.currentShift?.status !== shift_status_enum_1.ShiftStatusEnum.COMPLETED) {
                existing.currentShift.status = shift_status_enum_1.ShiftStatusEnum.COMPLETED;
                existing.currentShift.endTime = now;
                existing.currentShift.closedBy = user._id;
                existing.currentShift.closedByModel = roleModel;
            }
            const lastShiftIndex = existing.shifts.length - 1;
            if (lastShiftIndex >= 0) {
                existing.shifts[lastShiftIndex] = {
                    ...existing.shifts[lastShiftIndex],
                    status: shift_status_enum_1.ShiftStatusEnum.COMPLETED,
                    endTime: now,
                    closedBy: new mongoose_2.Types.ObjectId(user.adminId || user._id),
                    closedByModel: roleModel,
                };
            }
            updatePayload.pumpStatus = shift_status_enum_1.PumpStatusEnum.CLOSED;
            updatePayload.dailyClose = true;
            updatePayload.shifts = existing.shifts;
            updatePayload.currentShift = existing.currentShift;
        }
        // =====================================================
        // ✅ FINAL UPDATE
        // =====================================================
        return this.shiftStatusModel.findByIdAndUpdate(id, updatePayload, {
            new: true,
        });
    }
};
exports.ShiftStatusService = ShiftStatusService;
exports.ShiftStatusService = ShiftStatusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shift_status_schema_1.ShiftStatus.name)),
    __param(1, (0, mongoose_1.InjectModel)(pump_details_schema_1.PumpDetails.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ShiftStatusService);
