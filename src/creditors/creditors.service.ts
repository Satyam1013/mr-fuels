import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Creditor } from "./creditors.schema";
import { CreateCreditorDto, UpdateCreditorDto } from "./creditors.dto";
import { CustomerService } from "../customer/customer.service";
import { CreditStatusEnum } from "./creditors.enum";

@Injectable()
export class CreditorService {
  constructor(
    @InjectModel(Creditor.name)
    private creditorModel: Model<Creditor>,

    private customerService: CustomerService,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreateCreditorDto) {
    try {
      const customer = await this.customerService.findCustomerById(
        adminId,
        dto.customerId,
      );

      const creditStatus = dto.creditStatus ?? CreditStatusEnum.TAKEN;

      const saved = await this.creditorModel.create({
        adminId,
        customerId: customer._id,
        creditDate: dto.creditDate ? new Date(dto.creditDate) : new Date(),
        returnDate: dto.returnDate ? new Date(dto.returnDate) : undefined,
        shiftNumber: dto.shiftNumber,
        amount: dto.amount,
        creditBy: new Types.ObjectId(dto.creditBy),
        narration: dto.narration,
        photoUrl: dto.photoUrl,
        creditStatus,
        returnPaymentMode: dto.returnPaymentMode ?? null,
      });

      // ✅ Balance update
      if (creditStatus === CreditStatusEnum.TAKEN) {
        await this.customerService.incrementCreditBalance(
          adminId,
          customer._id as Types.ObjectId,
          dto.amount,
        );
      } else if (creditStatus === CreditStatusEnum.RETURNED) {
        await this.customerService.decrementCreditBalance(
          adminId,
          customer._id as Types.ObjectId,
          dto.amount,
        );
      }

      return {
        message: "Credit entry added successfully",
        data: saved,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll(adminId: Types.ObjectId) {
    return this.creditorModel
      .find({ adminId })
      .populate("customerId", "name phoneNumber")
      .lean();
  }

  async update(adminId: Types.ObjectId, id: string, dto: UpdateCreditorDto) {
    const existing = await this.creditorModel.findOne({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) {
      throw new NotFoundException(`Creditor entry ${id} not found.`);
    }

    if (dto.customerId) {
      await this.customerService.findCustomerById(adminId, dto.customerId);
    }

    // ✅ Status change hua → balance adjust karo
    if (dto.creditStatus && dto.creditStatus !== existing.creditStatus) {
      const amount = dto.amount ?? existing.amount;

      if (
        existing.creditStatus === CreditStatusEnum.TAKEN &&
        dto.creditStatus === CreditStatusEnum.RETURNED
      ) {
        // TAKEN → RETURNED: taken wala undo + returned apply
        await this.customerService.decrementCreditBalance(
          adminId,
          existing.customerId,
          amount,
        );
      } else if (
        existing.creditStatus === CreditStatusEnum.RETURNED &&
        dto.creditStatus === CreditStatusEnum.TAKEN
      ) {
        // RETURNED → TAKEN: returned wala undo + taken apply
        await this.customerService.incrementCreditBalance(
          adminId,
          existing.customerId,
          amount,
        );
      }
    }

    const updated = await this.creditorModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), adminId },
      {
        $set: {
          ...(dto.customerId && {
            customerId: new Types.ObjectId(dto.customerId),
          }),
          ...(dto.creditDate && { creditDate: new Date(dto.creditDate) }),
          ...(dto.returnDate && { returnDate: new Date(dto.returnDate) }),
          ...(dto.shiftNumber && { shiftNumber: dto.shiftNumber }),
          ...(dto.amount && { amount: dto.amount }),
          ...(dto.creditBy && { creditBy: new Types.ObjectId(dto.creditBy) }),
          ...(dto.narration !== undefined && { narration: dto.narration }),
          ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
          ...(dto.creditStatus && { creditStatus: dto.creditStatus }),
          ...(dto.returnPaymentMode !== undefined && {
            returnPaymentMode: dto.returnPaymentMode,
          }),
        },
      },
      { new: true },
    );

    return {
      message: "Credit entry updated successfully",
      data: updated,
    };
  }

  async remove(adminId: Types.ObjectId, id: string) {
    const existing = await this.creditorModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) {
      throw new NotFoundException(`Creditor entry ${id} not found.`);
    }

    // ✅ Delete pe bhi balance reverse karo
    if (existing.creditStatus === CreditStatusEnum.TAKEN) {
      await this.customerService.decrementCreditBalance(
        adminId,
        existing.customerId,
        existing.amount,
      );
    } else if (existing.creditStatus === CreditStatusEnum.RETURNED) {
      await this.customerService.incrementCreditBalance(
        adminId,
        existing.customerId,
        existing.amount,
      );
    }

    return {
      message: "Credit entry deleted successfully",
    };
  }
}
