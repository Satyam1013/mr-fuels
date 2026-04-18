import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum DepositByEnum {
  OWNER = "owner",
  MANAGER = "manager",
  STAFF = "staff",
}

@Schema({ timestamps: true })
export class BankDeposit extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  // Ek date + shift ke saare deposits group karne ke liye
  @Prop({ required: true })
  date!: string; // "YYYY-MM-DD"

  @Prop({ required: true })
  shiftNumber!: number;

  // Core amounts
  @Prop({ required: true, default: 0 })
  totalDepositAmount!: number;

  @Prop({ required: true, default: 0 })
  remainingAmount!: number;

  @Prop({ required: true, default: 0 })
  pumpCash!: number;

  @Prop({ default: 0 })
  additionalCash!: number;

  // Who deposited
  @Prop({ enum: DepositByEnum, required: true })
  depositBy!: DepositByEnum;

  @Prop({ required: true })
  depositorName!: string;

  // Agar staff ne deposit kiya toh staffId
  @Prop({ type: Types.ObjectId, ref: "Staff", default: null })
  staffId!: Types.ObjectId | null;

  // Version track karne ke liye — latest doc ka isLatest = true
  @Prop({ default: true })
  isLatest!: boolean;

  // Kis document ka revision hai ye (first entry ke liye null)
  @Prop({ type: Types.ObjectId, ref: "BankDeposit", default: null })
  previousEntryId!: Types.ObjectId | null;

  @Prop({ default: "" })
  remarks!: string;
}

export const BankDepositSchema = SchemaFactory.createForClass(BankDeposit);

// Compound index — date + shift ke saare docs quickly milein
BankDepositSchema.index({ adminId: 1, date: 1, shiftNumber: 1 });
