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
exports.BankDepositService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bank_deposit_schema_1 = require("./bank-deposit.schema");
let BankDepositService = class BankDepositService {
    constructor(bankDepositModel) {
        this.bankDepositModel = bankDepositModel;
    }
    // ─── POST ───────────────────────────────────────────────
    async create(adminId, dto) {
        // Step 1 — pichla latest doc pehle dhundo (updateMany se pehle)
        const previousLatest = await this.bankDepositModel
            .findOne({
            adminId,
            date: dto.date,
            shiftNumber: dto.shiftNumber,
            isLatest: true,
        })
            .select("_id")
            .lean();
        // Step 2 — ab saare purane docs ka isLatest = false
        if (previousLatest) {
            await this.bankDepositModel.updateMany({ adminId, date: dto.date, shiftNumber: dto.shiftNumber }, { $set: { isLatest: false } });
        }
        // Step 3 — naya doc create karo
        const deposit = await this.bankDepositModel.create({
            adminId,
            ...dto,
            staffId: dto.staffId ? new mongoose_2.Types.ObjectId(dto.staffId) : null,
            isLatest: true,
            // Chain: naya doc jaanta hai pichla kaun tha
            previousEntryId: previousLatest?._id ?? null,
        });
        return deposit;
    }
    // ─── GET ────────────────────────────────────────────────
    async findAll(adminId, date, shiftNumber) {
        const entries = await this.bankDepositModel
            .find({ adminId, date, shiftNumber })
            .sort({ createdAt: 1 }) // oldest → newest (history order)
            .lean();
        if (!entries.length) {
            throw new common_1.NotFoundException(`No deposit entries found for date ${date} shift ${shiftNumber}.`);
        }
        // Latest entry = last created = actual/final amounts
        const latest = entries[entries.length - 1];
        return {
            date,
            shiftNumber,
            totalEntries: entries.length,
            // Frontend ko directly actual amounts chahiye
            actualDepositAmount: latest.totalDepositAmount,
            actualRemainingAmount: latest.remainingAmount,
            actualPumpCash: latest.pumpCash,
            actualAdditionalCash: latest.additionalCash,
            // Latest full doc
            latestEntry: latest,
            // Poori history — index 0 = first entry, last = latest
            history: entries,
        };
    }
    // ─── PATCH ──────────────────────────────────────────────
    async update(adminId, id, dto) {
        const existing = await this.bankDepositModel.findOne({
            _id: new mongoose_2.Types.ObjectId(id),
            adminId,
        });
        if (!existing) {
            throw new common_1.NotFoundException(`Deposit entry ${id} not found.`);
        }
        Object.assign(existing, {
            ...dto,
            staffId: dto.staffId ? new mongoose_2.Types.ObjectId(dto.staffId) : existing.staffId,
        });
        await existing.save();
        return existing;
    }
};
exports.BankDepositService = BankDepositService;
exports.BankDepositService = BankDepositService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(bank_deposit_schema_1.BankDeposit.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BankDepositService);
