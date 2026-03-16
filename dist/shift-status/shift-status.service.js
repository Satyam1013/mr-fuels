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
let ShiftStatusService = class ShiftStatusService {
    constructor(shiftStatusModel) {
        this.shiftStatusModel = shiftStatusModel;
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
    async getByDate(adminId, date) {
        const adminObjectId = new mongoose_2.Types.ObjectId(adminId);
        const today = new Date().toISOString().split("T")[0];
        const requestedDate = date || today;
        // exact match
        const exact = await this.shiftStatusModel.findOne({
            adminId: adminObjectId,
            date: requestedDate,
        });
        if (exact) {
            return {
                mode: "exact",
                data: exact,
            };
        }
        // find latest record
        const latest = await this.shiftStatusModel
            .findOne({ adminId: adminObjectId })
            .sort({ date: -1 });
        // no history
        if (!latest) {
            return {
                mode: "template",
                reason: "no_history",
                date: requestedDate,
            };
        }
        const first = await this.shiftStatusModel
            .findOne({ adminId: adminObjectId })
            .sort({ date: 1 });
        if (!first) {
            return {
                mode: "template",
                reason: "no_history",
                date: requestedDate,
            };
        }
        const firstDate = first.date;
        if (requestedDate < firstDate) {
            return {
                mode: "out_of_range",
                message: "Selected date does not come in range, please try after the first registered date",
                firstRegisteredDate: firstDate,
            };
        }
        // unfinished previous day
        if (!latest.dailyClose && requestedDate > latest.date) {
            return {
                mode: "fallback",
                date: latest.date,
                requestedDate,
                reason: "previous_unfinished_day",
                data: latest,
            };
        }
        // missing row between first date and today
        if (requestedDate <= today) {
            return {
                mode: "no_data",
                reason: "no_data_for_date",
                date: requestedDate,
            };
        }
        // future date with all previous closed
        return {
            mode: "template",
            reason: "no_data_for_date",
            date: requestedDate,
        };
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
    __metadata("design:paramtypes", [mongoose_2.Model])
], ShiftStatusService);
