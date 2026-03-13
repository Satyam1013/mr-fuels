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
    async addStaff(adminId, payload) {
        const admin = await this.adminModel.findById(adminId);
        if (!admin) {
            throw new common_1.NotFoundException("Admin not found");
        }
        const { staff, numberOfStaff } = payload;
        if (numberOfStaff !== staff.length) {
            throw new common_1.ConflictException(`numberOfStaff (${numberOfStaff}) does not match staff array length (${staff.length})`);
        }
        const docs = [];
        for (const dto of staff) {
            const existing = await this.staffModel.findOne({
                adminId,
                staffNumber: dto.staffNumber,
            });
            if (existing) {
                throw new common_1.ConflictException(`Staff with number ${dto.staffNumber} already exists`);
            }
            docs.push({
                adminId: new mongoose_2.Types.ObjectId(adminId),
                ...dto,
            });
        }
        if (docs.length) {
            return await this.staffModel.insertMany(docs);
        }
        return [];
    }
    async getStaff(adminId) {
        return this.staffModel.find({ adminId: new mongoose_2.Types.ObjectId(adminId) });
    }
    async updateStaff(adminId, staffId, dto) {
        const staff = await this.staffModel.findById(staffId);
        if (!staff)
            throw new common_1.NotFoundException("Staff not found");
        if (staff.adminId.toString() !== adminId) {
            throw new common_1.ConflictException("Staff does not belong to the specified admin");
        }
        Object.assign(staff, dto);
        return staff.save();
    }
    async removeStaff(adminId, staffId) {
        const admin = await this.adminModel.findById(adminId);
        if (!admin) {
            throw new common_1.NotFoundException("Admin not found");
        }
        const staff = await this.staffModel.findById(staffId);
        if (!staff) {
            throw new common_1.NotFoundException("Staff not found");
        }
        if (staff.adminId.toString() !== adminId) {
            throw new common_1.ConflictException("Staff does not belong to the specified admin");
        }
        return await this.staffModel.findByIdAndDelete(staffId);
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
