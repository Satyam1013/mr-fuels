import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Prepaid } from "./prepaid.schema";
import { CreatePrepaidDto, UpdatePrepaidDto } from "./prepaid.dto";
import { CustomerService } from "../customer/customer.service";
import { PrepaidModeEnum } from "./prepaid.enum";

@Injectable()
export class PrepaidService {
  constructor(
    @InjectModel(Prepaid.name)
    private prepaidModel: Model<Prepaid>,

    private customerService: CustomerService,
  ) {}

  async create(adminId: Types.ObjectId, dto: CreatePrepaidDto) {
    const customer = await this.customerService.findCustomerById(
      adminId,
      dto.customerId,
    );

    const saved = await this.prepaidModel.create({
      adminId,
      customerId: customer._id,
      amount: dto.amount,
      date: new Date(dto.date),
      shiftNumber: dto.shiftNumber,
      creditBy: new Types.ObjectId(dto.creditBy),
      mode: dto.mode,
      productType: dto.productType ?? null,
      fuelType: dto.fuelType ?? null,
      nonFuelProductId: dto.nonFuelProductId
        ? new Types.ObjectId(dto.nonFuelProductId)
        : null,
      quantity: dto.quantity ?? null,
      narration: dto.narration,
      photoUrl: dto.photoUrl,
    });

    // ✅ Mode ke hisaab se balance update
    if (dto.mode === PrepaidModeEnum.DEPOSIT) {
      // Paisa deposit hua → prepaidBalance badha
      await this.customerService.incrementPrepaidBalance(
        adminId,
        new Types.ObjectId(String(customer._id)),
        dto.amount,
      );
    } else if (dto.mode === PrepaidModeEnum.TRANSIT) {
      // Fuel/NonFuel use hua → prepaidBalance ghata
      await this.customerService.decrementPrepaidBalance(
        adminId,
        new Types.ObjectId(String(customer._id)),
        dto.amount,
      );
    }

    return {
      message: "Prepaid entry added successfully",
      data: saved,
    };
  }

  async findAll(adminId: Types.ObjectId) {
    return this.prepaidModel
      .find({ adminId })
      .populate("customerId", "name phoneNumber")
      .lean();
  }

  async update(adminId: Types.ObjectId, id: string, dto: UpdatePrepaidDto) {
    const existing = await this.prepaidModel.findOne({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) {
      throw new NotFoundException(`Prepaid entry ${id} not found.`);
    }

    // ✅ Mode change hua → balance reverse karo
    if (dto.mode && dto.mode !== existing.mode) {
      const amount = dto.amount ?? existing.amount;

      if (
        existing.mode === PrepaidModeEnum.DEPOSIT &&
        dto.mode === PrepaidModeEnum.TRANSIT
      ) {
        // DEPOSIT → TRANSIT: deposit undo, transit apply
        await this.customerService.decrementPrepaidBalance(
          adminId,
          new Types.ObjectId(String(existing.customerId)),
          amount,
        );
        await this.customerService.decrementPrepaidBalance(
          adminId,
          new Types.ObjectId(String(existing.customerId)),
          amount,
        );
      } else if (
        existing.mode === PrepaidModeEnum.TRANSIT &&
        dto.mode === PrepaidModeEnum.DEPOSIT
      ) {
        // TRANSIT → DEPOSIT: transit undo, deposit apply
        await this.customerService.incrementPrepaidBalance(
          adminId,
          new Types.ObjectId(String(existing.customerId)),
          amount,
        );
        await this.customerService.incrementPrepaidBalance(
          adminId,
          new Types.ObjectId(String(existing.customerId)),
          amount,
        );
      }
    }

    const updated = await this.prepaidModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id), adminId },
      {
        $set: {
          ...(dto.amount && { amount: dto.amount }),
          ...(dto.date && { date: new Date(dto.date) }),
          ...(dto.shiftNumber && { shiftNumber: dto.shiftNumber }),
          ...(dto.creditBy && { creditBy: new Types.ObjectId(dto.creditBy) }),
          ...(dto.mode && { mode: dto.mode }),
          ...(dto.productType !== undefined && {
            productType: dto.productType,
          }),
          ...(dto.fuelType !== undefined && { fuelType: dto.fuelType }),
          ...(dto.nonFuelProductId && {
            nonFuelProductId: new Types.ObjectId(dto.nonFuelProductId),
          }),
          ...(dto.quantity !== undefined && { quantity: dto.quantity }),
          ...(dto.narration !== undefined && { narration: dto.narration }),
          ...(dto.photoUrl !== undefined && { photoUrl: dto.photoUrl }),
        },
      },
      { new: true },
    );

    return {
      message: "Prepaid entry updated successfully",
      data: updated,
    };
  }

  async remove(adminId: Types.ObjectId, id: string) {
    const existing = await this.prepaidModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      adminId,
    });

    if (!existing) {
      throw new NotFoundException(`Prepaid entry ${id} not found.`);
    }

    // ✅ Delete pe balance reverse karo
    if (existing.mode === PrepaidModeEnum.DEPOSIT) {
      await this.customerService.decrementPrepaidBalance(
        adminId,
        new Types.ObjectId(String(existing.customerId)),
        existing.amount,
      );
    } else if (existing.mode === PrepaidModeEnum.TRANSIT) {
      await this.customerService.incrementPrepaidBalance(
        adminId,
        new Types.ObjectId(String(existing.customerId)),
        existing.amount,
      );
    }

    return {
      message: "Prepaid entry deleted successfully",
    };
  }
}
