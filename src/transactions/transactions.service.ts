import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { TransactionDetails } from "./transactions.schema";
import { Admin } from "../admin/admin.schema";
import { CreateTransactionDetailsDto } from "./transactions.dto";

@Injectable()
export class TransactionDetailsService {
  constructor(
    @InjectModel(TransactionDetails.name)
    private transactionDetailsModel: Model<TransactionDetails>,

    @InjectModel(Admin.name)
    private adminModel: Model<Admin>,
  ) {}

  async addTransactionDetails(
    adminId: Types.ObjectId,
    dto: CreateTransactionDetailsDto,
  ) {
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException("Admin not found");
    }

    // one transaction details per admin
    const existing = await this.transactionDetailsModel.findOne({ adminId });

    if (existing) {
      return this.transactionDetailsModel.findByIdAndUpdate(existing._id, dto, {
        new: true,
      });
    }

    return this.transactionDetailsModel.create({
      adminId,
      ...dto,
    });
  }

  async getTransactionDetails(adminId: Types.ObjectId) {
    const transaction = await this.transactionDetailsModel.findOne({
      adminId,
    });

    if (!transaction) {
      throw new NotFoundException("Transaction details not found");
    }

    return transaction;
  }

  async updateTransactionDetails(
    adminId: Types.ObjectId,
    dto: CreateTransactionDetailsDto,
  ) {
    const transaction = await this.transactionDetailsModel.findOneAndUpdate(
      { adminId: new Types.ObjectId(adminId) },
      dto,
      { new: true },
    );

    if (!transaction) {
      throw new NotFoundException("Transaction details not found");
    }

    return transaction;
  }

  async deleteTransactionDetails(adminId: Types.ObjectId) {
    const transaction = await this.transactionDetailsModel.findOneAndDelete({
      adminId,
    });

    if (!transaction) {
      throw new NotFoundException("Transaction details not found");
    }

    return { message: "Transaction details deleted successfully" };
  }
}
