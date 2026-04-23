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
exports.PrepaidService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const prepaid_schema_1 = require("./prepaid.schema");
const customer_service_1 = require("../customer/customer.service");
let PrepaidService = class PrepaidService {
    constructor(prepaidModel, customerService) {
        this.prepaidModel = prepaidModel;
        this.customerService = customerService;
    }
    async create(adminId, dto) {
        const customer = await this.customerService.findCustomerById(adminId, dto.customerId);
        const saved = await this.prepaidModel.create({
            adminId,
            customerId: customer._id,
            amount: dto.amount,
            date: new Date(dto.date),
            shiftNumber: dto.shiftNumber,
            creditBy: new mongoose_2.Types.ObjectId(dto.creditBy),
            mode: dto.mode,
            productType: dto.productType ?? null,
            fuelType: dto.fuelType ?? null,
            nonFuelProductId: dto.nonFuelProductId
                ? new mongoose_2.Types.ObjectId(dto.nonFuelProductId)
                : null,
            quantity: dto.quantity ?? null,
            narration: dto.narration,
            photoUrl: dto.photoUrl,
        });
        return {
            message: "Prepaid entry added successfully",
            data: saved,
        };
    }
    async findAll(adminId) {
        return this.prepaidModel
            .find({ adminId })
            .populate("customerId", "name phoneNumber")
            .lean();
    }
};
exports.PrepaidService = PrepaidService;
exports.PrepaidService = PrepaidService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(prepaid_schema_1.Prepaid.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        customer_service_1.CustomerService])
], PrepaidService);
