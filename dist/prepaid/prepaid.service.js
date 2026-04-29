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
const prepaid_enum_1 = require("./prepaid.enum");
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
        // ✅ Mode ke hisaab se balance update
        if (dto.mode === prepaid_enum_1.PrepaidModeEnum.DEPOSIT) {
            // Paisa deposit hua → prepaidBalance badha
            await this.customerService.incrementPrepaidBalance(adminId, new mongoose_2.Types.ObjectId(String(customer._id)), dto.amount);
        }
        else if (dto.mode === prepaid_enum_1.PrepaidModeEnum.TRANSIT) {
            // Fuel/NonFuel use hua → prepaidBalance ghata
            await this.customerService.decrementPrepaidBalance(adminId, new mongoose_2.Types.ObjectId(String(customer._id)), dto.amount);
        }
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
    async update(adminId, id, dto) {
        const existing = await this.prepaidModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Prepaid entry ${id} not found.`);
        }
        // ✅ Mode change hua → balance reverse karo
        if (dto.mode && dto.mode !== existing.mode) {
            const amount = dto.amount ?? existing.amount;
            if (existing.mode === prepaid_enum_1.PrepaidModeEnum.DEPOSIT &&
                dto.mode === prepaid_enum_1.PrepaidModeEnum.TRANSIT) {
                // DEPOSIT → TRANSIT: deposit undo, transit apply
                await this.customerService.decrementPrepaidBalance(adminId, new mongoose_2.Types.ObjectId(String(existing.customerId)), amount);
                await this.customerService.decrementPrepaidBalance(adminId, new mongoose_2.Types.ObjectId(String(existing.customerId)), amount);
            }
            else if (existing.mode === prepaid_enum_1.PrepaidModeEnum.TRANSIT &&
                dto.mode === prepaid_enum_1.PrepaidModeEnum.DEPOSIT) {
                // TRANSIT → DEPOSIT: transit undo, deposit apply
                await this.customerService.incrementPrepaidBalance(adminId, new mongoose_2.Types.ObjectId(String(existing.customerId)), amount);
                await this.customerService.incrementPrepaidBalance(adminId, new mongoose_2.Types.ObjectId(String(existing.customerId)), amount);
            }
        }
        const updated = await this.prepaidModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), adminId }, {
            $set: {
                ...(dto.amount && { amount: dto.amount }),
                ...(dto.date && { date: new Date(dto.date) }),
                ...(dto.shiftNumber && { shiftNumber: dto.shiftNumber }),
                ...(dto.creditBy && { creditBy: new mongoose_2.Types.ObjectId(dto.creditBy) }),
                ...(dto.mode && { mode: dto.mode }),
                ...(dto.productType !== undefined && {
                    productType: dto.productType,
                }),
                ...(dto.fuelType !== undefined && { fuelType: dto.fuelType }),
                ...(dto.nonFuelProductId && {
                    nonFuelProductId: new mongoose_2.Types.ObjectId(dto.nonFuelProductId),
                }),
                ...(dto.quantity !== undefined && { quantity: dto.quantity }),
                ...(dto.narration !== undefined && { narration: dto.narration }),
                ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
            },
        }, { new: true });
        return {
            message: "Prepaid entry updated successfully",
            data: updated,
        };
    }
    async remove(adminId, id) {
        const existing = await this.prepaidModel.findOneAndDelete({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Prepaid entry ${id} not found.`);
        }
        // ✅ Delete pe balance reverse karo
        if (existing.mode === prepaid_enum_1.PrepaidModeEnum.DEPOSIT) {
            await this.customerService.decrementPrepaidBalance(adminId, new mongoose_2.Types.ObjectId(String(existing.customerId)), existing.amount);
        }
        else if (existing.mode === prepaid_enum_1.PrepaidModeEnum.TRANSIT) {
            await this.customerService.incrementPrepaidBalance(adminId, new mongoose_2.Types.ObjectId(String(existing.customerId)), existing.amount);
        }
        return {
            message: "Prepaid entry deleted successfully",
        };
    }
};
exports.PrepaidService = PrepaidService;
exports.PrepaidService = PrepaidService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(prepaid_schema_1.Prepaid.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        customer_service_1.CustomerService])
], PrepaidService);
