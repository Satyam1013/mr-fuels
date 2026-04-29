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
const customer_service_1 = require("../customer/customer.service");
const creditors_enum_1 = require("./creditors.enum");
let CreditorService = class CreditorService {
    constructor(creditorModel, customerService) {
        this.creditorModel = creditorModel;
        this.customerService = customerService;
    }
    async create(adminId, dto) {
        try {
            const customer = await this.customerService.findCustomerById(adminId, dto.customerId);
            const creditStatus = dto.creditStatus ?? creditors_enum_1.CreditStatusEnum.TAKEN;
            const saved = await this.creditorModel.create({
                adminId,
                customerId: customer._id,
                creditDate: dto.creditDate ? new Date(dto.creditDate) : new Date(),
                returnDate: dto.returnDate ? new Date(dto.returnDate) : undefined,
                shiftNumber: dto.shiftNumber,
                amount: dto.amount,
                creditBy: new mongoose_2.Types.ObjectId(dto.creditBy),
                narration: dto.narration,
                photoUrl: dto.photoUrl,
                creditStatus,
                returnPaymentMode: dto.returnPaymentMode ?? null,
            });
            // ✅ Balance update
            if (creditStatus === creditors_enum_1.CreditStatusEnum.TAKEN) {
                await this.customerService.incrementCreditBalance(adminId, customer._id, dto.amount);
            }
            else if (creditStatus === creditors_enum_1.CreditStatusEnum.RETURNED) {
                await this.customerService.decrementCreditBalance(adminId, customer._id, dto.amount);
            }
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
        return this.creditorModel
            .find({ adminId })
            .populate("customerId", "name phoneNumber")
            .lean();
    }
    async update(adminId, id, dto) {
        const existing = await this.creditorModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Creditor entry ${id} not found.`);
        }
        if (dto.customerId) {
            await this.customerService.findCustomerById(adminId, dto.customerId);
        }
        // ✅ Status change hua → balance adjust karo
        if (dto.creditStatus && dto.creditStatus !== existing.creditStatus) {
            const amount = dto.amount ?? existing.amount;
            if (existing.creditStatus === creditors_enum_1.CreditStatusEnum.TAKEN &&
                dto.creditStatus === creditors_enum_1.CreditStatusEnum.RETURNED) {
                // TAKEN → RETURNED: taken wala undo + returned apply
                await this.customerService.decrementCreditBalance(adminId, existing.customerId, amount);
            }
            else if (existing.creditStatus === creditors_enum_1.CreditStatusEnum.RETURNED &&
                dto.creditStatus === creditors_enum_1.CreditStatusEnum.TAKEN) {
                // RETURNED → TAKEN: returned wala undo + taken apply
                await this.customerService.incrementCreditBalance(adminId, existing.customerId, amount);
            }
        }
        const updated = await this.creditorModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(id), adminId }, {
            $set: {
                ...(dto.customerId && {
                    customerId: new mongoose_2.Types.ObjectId(dto.customerId),
                }),
                ...(dto.creditDate && { creditDate: new Date(dto.creditDate) }),
                ...(dto.returnDate && { returnDate: new Date(dto.returnDate) }),
                ...(dto.shiftNumber && { shiftNumber: dto.shiftNumber }),
                ...(dto.amount && { amount: dto.amount }),
                ...(dto.creditBy && { creditBy: new mongoose_2.Types.ObjectId(dto.creditBy) }),
                ...(dto.narration !== undefined && { narration: dto.narration }),
                ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
                ...(dto.creditStatus && { creditStatus: dto.creditStatus }),
                ...(dto.returnPaymentMode !== undefined && {
                    returnPaymentMode: dto.returnPaymentMode,
                }),
            },
        }, { new: true });
        return {
            message: "Credit entry updated successfully",
            data: updated,
        };
    }
    async remove(adminId, id) {
        const existing = await this.creditorModel.findOneAndDelete({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Creditor entry ${id} not found.`);
        }
        // ✅ Delete pe bhi balance reverse karo
        if (existing.creditStatus === creditors_enum_1.CreditStatusEnum.TAKEN) {
            await this.customerService.decrementCreditBalance(adminId, existing.customerId, existing.amount);
        }
        else if (existing.creditStatus === creditors_enum_1.CreditStatusEnum.RETURNED) {
            await this.customerService.incrementCreditBalance(adminId, existing.customerId, existing.amount);
        }
        return {
            message: "Credit entry deleted successfully",
        };
    }
};
exports.CreditorService = CreditorService;
exports.CreditorService = CreditorService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(creditors_schema_1.Creditor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        customer_service_1.CustomerService])
], CreditorService);
