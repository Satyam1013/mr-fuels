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
exports.CreditorService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const creditors_schema_1 = require("./creditors.schema");
const machines_schema_1 = require("../machines/machines.schema");
const customer_service_1 = require("../customer/customer.service");
let CreditorService = class CreditorService {
    constructor(creditorModel, machineModel, customerService) {
        this.creditorModel = creditorModel;
        this.machineModel = machineModel;
        this.customerService = customerService;
    }
    async create(adminId, dto) {
        try {
            const machine = await this.machineModel.findOne({
                _id: new mongoose_2.Types.ObjectId(dto.machineId),
                adminId,
            });
            if (!machine) {
                throw new common_1.BadRequestException("Machine not found");
            }
            const nozzle = machine.nozzle.find((n) => n.nozzleNumber === dto.nozzleNumber && n.isActive);
            if (!nozzle) {
                throw new common_1.BadRequestException("Invalid nozzle number");
            }
            const customer = await this.customerService.findOrCreateCustomer(adminId, dto.creditorName, dto.phoneNumber);
            const saved = await this.creditorModel.create({
                adminId,
                customerId: customer._id,
                machineId: new mongoose_2.Types.ObjectId(dto.machineId),
                nozzleNumber: dto.nozzleNumber,
                creditorName: dto.creditorName,
                date: new Date(dto.date),
                shiftNumber: dto.shiftNumber,
                amount: dto.amount,
                creditBy: dto.creditBy,
                phoneNumber: dto.phoneNumber,
                narration: dto.narration,
                photoUrl: dto.photoUrl,
            });
            return {
                message: "Credit entry added successfully",
                data: saved,
            };
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    async findAll(adminId) {
        return this.creditorModel.find({
            adminId,
        });
    }
};
exports.CreditorService = CreditorService;
exports.CreditorService = CreditorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(creditors_schema_1.Creditor.name)),
    __param(1, (0, mongoose_1.InjectModel)(machines_schema_1.Machine.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        customer_service_1.CustomerService])
], CreditorService);
