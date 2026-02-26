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
exports.DsrDetailsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dsr_schema_1 = require("./dsr.schema");
const dsr_details_types_1 = require("../types/dsr-details-types");
let DsrDetailsService = class DsrDetailsService {
    constructor(dsrModel) {
        this.dsrModel = dsrModel;
    }
    async addOrUpdate(adminId, dto) {
        for (const tank of dto.tankConfig) {
            if (tank.inputType === dsr_details_types_1.TankInputType.CHART && !tank.dsrChart) {
                throw new Error(`DSR Chart is required for tank ${tank.tankNo}`);
            }
            if (tank.inputType === dsr_details_types_1.TankInputType.MANUAL &&
                (!tank.capacity || !tank.diameter || !tank.length || !tank.tankType)) {
                throw new Error(`All manual fields are required for tank ${tank.tankNo}`);
            }
        }
        const existing = await this.dsrModel.findOne({ adminId });
        if (existing) {
            existing.tankConfig = dto.tankConfig;
            return existing.save();
        }
        return this.dsrModel.create({
            adminId: new mongoose_2.Types.ObjectId(adminId),
            tankConfig: dto.tankConfig,
        });
    }
    async getByAdmin(adminId) {
        return this.dsrModel.findOne({ adminId });
    }
};
exports.DsrDetailsService = DsrDetailsService;
exports.DsrDetailsService = DsrDetailsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dsr_schema_1.DsrDetails.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DsrDetailsService);
