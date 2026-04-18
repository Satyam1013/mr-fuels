import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BankDeposit } from "./bank-deposit.schema";
import { CreateBankDepositDto } from "./bank-deposit.dto";
import { UpdateBankDepositDto } from "./bank-deposit.dto";

@Injectable()
export class BankDepositService {
  constructor(
    @InjectModel(BankDeposit.name)
    private bankDepositModel: Model<BankDeposit>,
  ) {}

  // ─── POST ───────────────────────────────────────────────
  async create(adminId: Types.ObjectId, dto: CreateBankDepositDto) {
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
      await this.bankDepositModel.updateMany(
        { adminId, date: dto.date, shiftNumber: dto.shiftNumber },
        { $set: { isLatest: false } },
      );
    }

    // Step 3 — naya doc create karo
    const deposit = await this.bankDepositModel.create({
      adminId,
      ...dto,
      staffId: dto.staffId ? new Types.ObjectId(dto.staffId) : null,
      isLatest: true,
      // Chain: naya doc jaanta hai pichla kaun tha
      previousEntryId: previousLatest?._id ?? null,
    });

    return deposit;
  }

  // ─── GET ────────────────────────────────────────────────
  async findAll(adminId: Types.ObjectId, date: string, shiftNumber: number) {
    const entries = await this.bankDepositModel
      .find({ adminId, date, shiftNumber })
      .sort({ createdAt: 1 }) // oldest → newest (history order)
      .lean();

    if (!entries.length) {
      throw new NotFoundException(
        `No deposit entries found for date ${date} shift ${shiftNumber}.`,
      );
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
  async update(adminId: Types.ObjectId, id: string, dto: UpdateBankDepositDto) {
    const existing = await this.bankDepositModel.findOne({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) {
      throw new NotFoundException(`Deposit entry ${id} not found.`);
    }

    Object.assign(existing, {
      ...dto,
      staffId: dto.staffId ? new Types.ObjectId(dto.staffId) : existing.staffId,
    });

    await existing.save();
    return existing;
  }
}
