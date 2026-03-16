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
const shift_status_enum_1 = require("./shift-status.enum");
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
        // 1️⃣ exact date find
        const data = await this.shiftStatusModel.findOne({
            adminId: adminObjectId,
            date,
        });
        if (data) {
            if (data.pumpStatus === shift_status_enum_1.PumpStatusEnum.CLOSED ||
                data.pumpStatus === shift_status_enum_1.PumpStatusEnum.HOLIDAY) {
                return {
                    message: "Pump is closed",
                    pumpStatus: data.pumpStatus,
                };
            }
            return data;
        }
        // 2️⃣ latest record find
        const latest = await this.shiftStatusModel
            .findOne({ adminId: adminObjectId })
            .sort({ date: -1 });
        if (!latest) {
            return {
                message: "no data is available",
                pumpStatus: shift_status_enum_1.PumpStatusEnum.OPEN,
            };
        }
        const today = new Date().toISOString().split("T")[0];
        // agar last day close nahi hua → wahi chal raha hai
        if (!latest.dailyClose) {
            return latest;
        }
        // agar requested date today hai aur aaj ka record nahi bana
        if (date === today) {
            return {
                message: "no data is available",
                pumpStatus: shift_status_enum_1.PumpStatusEnum.OPEN,
            };
        }
        return {
            message: "no data is available",
            pumpStatus: shift_status_enum_1.PumpStatusEnum.OPEN,
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
