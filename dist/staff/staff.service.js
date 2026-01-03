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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const staff_schema_1 = require("./staff.schema");
const admin_schema_1 = require("../admin/admin.schema");
let StaffService = class StaffService {
    constructor(staffModel, adminModel) {
        this.staffModel = staffModel;
        this.adminModel = adminModel;
    }
    async addStaff(adminId, dto) {
        const admin = await this.adminModel.findById(adminId);
        if (!admin) {
            throw new common_1.NotFoundException("Admin not found");
        }
        const existing = await this.staffModel.findOne({
            adminId,
            staffNumber: dto.staffNumber,
        });
        if (existing) {
            throw new common_1.ConflictException("Staff with this number already exists");
        }
        return this.staffModel.create({
            adminId: new mongoose_2.Types.ObjectId(adminId),
            ...dto,
        });
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(staff_schema_1.Staff.name)),
    __param(1, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], StaffService);
