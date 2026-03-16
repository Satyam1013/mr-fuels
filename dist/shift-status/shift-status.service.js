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
let ShiftStatusService = class ShiftStatusService {
    constructor(shiftStatusModel, pumpDetailsModel) {
        this.shiftStatusModel = shiftStatusModel;
        this.pumpDetailsModel = pumpDetailsModel;
    }
    async create(adminId, dto) {
        const adminObjectId = new mongoose_2.Types.ObjectId(adminId);
        const existing = await this.shiftStatusModel.findOne({
            adminId: adminObjectId,
            date: dto.date,
        });
        if (existing) {
            throw new common_1.BadRequestException("Shift status already created for this date");
        }
        return this.shiftStatusModel.create({
            ...dto,
            adminId: adminObjectId,
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
        const adminObjectId = new mongoose_2.Types.ObjectId(adminId);
        const pumpDetails = await this.pumpDetailsModel
            .findOne({ adminId: adminObjectId })
            .lean();
        if (!pumpDetails) {
            throw new Error("Pump details not found");
        }
        const today = new Date().toISOString().split("T")[0];
        const requestedDate = date || today;
        const formattedNumberDate = Number(requestedDate.replace(/-/g, "") + "01");
        // check exact data
        const exact = await this.shiftStatusModel.findOne({
            adminId: adminObjectId,
            date: requestedDate,
        });
        // ----------- EXACT DATA -----------
        if (exact) {
            const completedShifts = exact.shifts.filter((s) => s.status === shift_status_enum_1.ShiftStatusEnum.COMPLETED).length;
            const pendingShifts = pumpDetails.numberOfShifts - completedShifts;
            const percent = (completedShifts / pumpDetails.numberOfShifts) * 100;
            return {
                date: requestedDate,
                totalShifts: pumpDetails.numberOfShifts,
                currentShift: exact.currentShift,
                shifts: exact.shifts,
                dailyProgress: {
                    completedShifts,
                    pendingShifts,
                    overallCompletionPercent: percent,
                },
                dailyClose: exact.dailyClose,
                pumpStatus: exact.pumpStatus,
            };
        }
        // ----------- LATEST RECORD -----------
        const latest = await this.shiftStatusModel
            .findOne({ adminId: adminObjectId })
            .sort({ date: -1 });
        if (!latest) {
            return this.buildTemplate(pumpDetails, requestedDate, formattedNumberDate);
        }
        const first = await this.shiftStatusModel
            .findOne({ adminId: adminObjectId })
            .sort({ date: 1 });
        if (!first) {
            return this.buildTemplate(pumpDetails, requestedDate, formattedNumberDate);
        }
        if (requestedDate < first.date) {
            return {
                message: "Selected date does not come in range, please try after the first registered date",
                firstRegisteredDate: first.date,
            };
        }
        // unfinished previous day
        if (!latest.dailyClose && requestedDate > latest.date) {
            const completedShifts = latest.shifts.filter((s) => s.status === shift_status_enum_1.ShiftStatusEnum.COMPLETED).length;
            const pendingShifts = pumpDetails.numberOfShifts - completedShifts;
            const percent = (completedShifts / pumpDetails.numberOfShifts) * 100;
            return {
                date: latest.date,
                requestedDate,
                reason: "previous_unfinished_day",
                totalShifts: pumpDetails.numberOfShifts,
                currentShift: latest.currentShift,
                shifts: latest.shifts,
                dailyProgress: {
                    completedShifts,
                    pendingShifts,
                    overallCompletionPercent: percent,
                },
                dailyClose: latest.dailyClose,
                pumpStatus: latest.pumpStatus,
            };
        }
        if (requestedDate <= today) {
            return {
                message: "No data available for this date",
                date: requestedDate,
            };
        }
        // future template
        return this.buildTemplate(pumpDetails, requestedDate, formattedNumberDate);
    }
    async update(id, dto) {
        return this.shiftStatusModel.findByIdAndUpdate(id, dto, {
            new: true,
        });
    }
    async closeDay(id) {
        return this.shiftStatusModel.findByIdAndUpdate(id, { dailyClose: true }, { new: true });
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
