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
const managers_schema_1 = require("../managers/managers.schema");
const admin_schema_1 = require("../admin/admin.schema");
let ShiftStatusService = class ShiftStatusService {
    constructor(shiftStatusModel, pumpDetailsModel, adminModel, managerModel) {
        this.shiftStatusModel = shiftStatusModel;
        this.pumpDetailsModel = pumpDetailsModel;
        this.adminModel = adminModel;
        this.managerModel = managerModel;
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
        // ---------------- HELPERS ----------------
        const fetchClosedByInfo = async (id) => {
            if (!id)
                return null;
            // 1️⃣ Check in Admins
            const admin = await this.adminModel
                .findById(id)
                .select("businessName email role")
                .lean();
            if (admin)
                return {
                    id: admin._id,
                    name: admin.businessName || "",
                    email: admin.email || "",
                    role: admin.role,
                };
            // 2️⃣ Check in Managers
            const manager = await this.managerModel
                .findById(id)
                .select("managerName phone role")
                .lean();
            if (manager)
                return {
                    id: manager._id,
                    name: manager.managerName || "",
                    email: manager.phone || "",
                    role: manager.role,
                };
            return null;
        };
        const mapClosedBy = async (shift) => {
            if (!shift?.closedBy)
                return null;
            // ✅ Fix: ObjectId instance check — directly fetch karo
            if (shift.closedBy instanceof mongoose_2.Types.ObjectId) {
                return fetchClosedByInfo(shift.closedBy);
            }
            // ✅ Populated object — actual fields exist check karo
            if (typeof shift.closedBy === "object" &&
                "_id" in shift.closedBy &&
                ("name" in shift.closedBy || "managerName" in shift.closedBy)) {
                const populated = shift.closedBy;
                return {
                    id: populated._id?.toString() || null,
                    name: populated.name || "",
                    email: populated.email || "",
                    role: shift.closedByModel,
                };
            }
            return fetchClosedByInfo(shift.closedBy);
        };
        const mapResponse = async (data) => {
            const completedShifts = data.shifts.filter((s) => s.status === shift_status_enum_1.ShiftStatusEnum.COMPLETED).length;
            const totalShifts = pumpDetails.numberOfShifts || 0;
            const pendingShifts = totalShifts - completedShifts;
            const percent = totalShifts > 0 ? (completedShifts / totalShifts) * 100 : 0;
            // Map shifts with closedBy info
            const shiftsWithClosedBy = [];
            for (const s of data.shifts || []) {
                shiftsWithClosedBy.push({
                    ...s,
                    closedBy: await mapClosedBy(s),
                });
            }
            const currentShiftWithClosedBy = data.currentShift
                ? {
                    ...data.currentShift,
                    closedBy: await mapClosedBy(data.currentShift),
                }
                : null;
            return {
                _id: data._id?.toString(),
                date: data.date,
                totalShifts,
                currentShift: currentShiftWithClosedBy,
                shifts: shiftsWithClosedBy,
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
            .findOne({ adminId, date: requestedDate })
            .lean();
        if (exact) {
            return mapResponse(exact);
        }
        // ----------- LATEST RECORD -----------
        const latest = await this.shiftStatusModel
            .findOne({ adminId })
            .sort({ date: -1 })
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
        // ----------- PREVIOUS UNFINISHED -----------
        // Agar latest record ka dailyClose nahi hua aur requested date usse aage hai
        if (!latest.dailyClose && reqDateObj > latestDateObj) {
            return {
                ...(await mapResponse(latest)),
                requestedDate,
                reason: "previous_unfinished_day",
            };
        }
        // ----------- NO DATA FOR PAST / TODAY -----------
        if (reqDateObj <= todayObj) {
            // ✅ Agar latest record closed hai aur requested date usse aage hai
            // → Check karo ki koi gap hai ya nahi
            if (latest.dailyClose && reqDateObj > latestDateObj) {
                // Next consecutive day calculate karo latest closed record ke baad
                const dayAfterLatest = new Date(latestDateObj);
                dayAfterLatest.setDate(dayAfterLatest.getDate() + 1);
                dayAfterLatest.setHours(0, 0, 0, 0);
                const reqNormalized = new Date(reqDateObj);
                reqNormalized.setHours(0, 0, 0, 0);
                if (reqNormalized.getTime() === dayAfterLatest.getTime()) {
                    // ✅ No gap — bilkul agla din hai, fresh template return karo
                    return this.buildTemplate(pumpDetails, requestedDate, formattedNumberDate);
                }
                // ❌ Gap hai — beech ki dates missing hain
                return {
                    message: "No data available for this date",
                    date: requestedDate,
                };
            }
            // Requested date latest se pehle hai ya same hai but exact record nahi mila
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
        // Normalize role string
        let roleModel;
        switch (user.role.toLowerCase()) {
            case "admin":
                roleModel = admin_enum_1.Role.ADMIN;
                break;
            case "manager":
                roleModel = admin_enum_1.Role.MANAGER;
                break;
            case "staff":
                roleModel = admin_enum_1.Role.STAFF;
                break;
            default:
                roleModel = admin_enum_1.Role.MANAGER;
        }
        const updatePayload = {};
        // =====================================================
        // 1️⃣ HANDLE SHIFT UPDATE (PATCH) → ADD ONLY IF PATCH PROVIDES NEW
        // =====================================================
        if (dto.shifts && dto.shifts.length > 0) {
            dto.shifts.forEach((incomingShift) => {
                const index = existing.shifts.findIndex((s) => s.shiftNumber === incomingShift.shiftNumber);
                if (index === -1) {
                    // 🔹 NEW shift → only if patch explicitly has it
                    existing.shifts.push({
                        shiftNumber: incomingShift.shiftNumber,
                        name: incomingShift.name || `Shift ${incomingShift.shiftNumber}`,
                        startTime: incomingShift.startTime,
                        endTime: incomingShift.endTime,
                        status: incomingShift.status || shift_status_enum_1.ShiftStatusEnum.PENDING,
                        ...(incomingShift.status === shift_status_enum_1.ShiftStatusEnum.COMPLETED && {
                            closedBy: new mongoose_2.Types.ObjectId(user.adminId || user._id),
                            closedByModel: roleModel,
                        }),
                    });
                }
                else {
                    // 🔹 EXISTING shift → update fields
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
        // 2️⃣ UPDATE currentShift (SAFE) → IF LAST SHIFT COMPLETED, currentShift points to next number
        // =====================================================
        const activeShift = existing.shifts.find((s) => s.status === shift_status_enum_1.ShiftStatusEnum.ACTIVE);
        const lastShift = existing.shifts[existing.shifts.length - 1];
        // ✅ Logic: currentShift = activeShift if exists, else last shift (even if completed)
        existing.currentShift = activeShift || {
            shiftNumber: (lastShift?.shiftNumber || 0) + 1, // next shift number
            name: `Shift ${(lastShift?.shiftNumber || 0) + 1}`,
            status: shift_status_enum_1.ShiftStatusEnum.PENDING, // not yet started
        };
        updatePayload.currentShift = existing.currentShift;
        // =====================================================
        // 3️⃣ DAILY CLOSE (FULL SAFE)
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
        // 4️⃣ FINAL UPDATE
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
    __param(2, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(3, (0, mongoose_1.InjectModel)(managers_schema_1.Manager.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ShiftStatusService);
