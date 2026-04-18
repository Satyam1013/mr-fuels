import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ShiftStatusEnum } from "../shift-status/shift-status.enum";

@Schema({ timestamps: true })
export class Sales extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  shiftNumber!: number;

  @Prop({ required: true })
  date!: string;

  @Prop({ type: Object })
  overallSales!: { liters: number; amount: number };

  @Prop({ type: Object })
  netSales!: { liters: number; amount: number };

  @Prop({ type: Object })
  testing!: { liters: number; amount: number };

  @Prop()
  overallCreditorsAmount!: number;

  @Prop()
  prepaid!: number;

  @Prop()
  pumpExpenses!: number;

  @Prop()
  personalExpenses!: number;

  @Prop()
  lubricantSales!: number;

  @Prop({ type: Object })
  transactions!: { upi: number; pos: number };

  @Prop({ type: Object })
  machines!: object;

  @Prop({ type: Array, default: [] })
  staff!: object[];

  @Prop({ enum: ShiftStatusEnum, default: ShiftStatusEnum.PENDING })
  shiftStatus!: ShiftStatusEnum;

  // ── Return Credit ──
  @Prop({ type: Object, default: { upi: 0, cash: 0, accountPay: 0 } })
  returnCreditTotals!: { upi: number; cash: number; accountPay: number };

  @Prop({ default: 0 })
  returnCreditUpi!: number;

  @Prop({ default: 0 })
  returnCreditCash!: number;

  @Prop({ default: 0 })
  returnCreditAccountPay!: number;

  // ── Deposit ──
  @Prop({ default: 0 })
  remainingDepositedAmount!: number;

  @Prop({ default: 0 })
  depositAmount!: number;

  @Prop({ default: 0 })
  additionalDepositAmount!: number;

  @Prop({ default: 0 })
  moneyDeposited!: number;

  // ── Cash Summary ──
  @Prop({ default: 0 })
  inHandCash!: number;

  @Prop({ default: 0 })
  overallAmountGeneratedByPump!: number;

  @Prop({ default: 0 })
  amountReceivedToPump!: number;

  // ── Difference Summary ──
  @Prop({
    type: Object,
    default: {
      mainDifference: 0,
      overallShortage: 0,
      overallPumpSalesShortage: 0,
      overallShortageMoneyReceived: 0,
      inHandCash: 0,
      moneyDeposited: 0,
    },
  })
  differenceSummary!: {
    mainDifference: number;
    overallShortage: number;
    overallPumpSalesShortage: number;
    overallShortageMoneyReceived: number;
    inHandCash: number;
    moneyDeposited: number;
  };
}

export const SalesSchema = SchemaFactory.createForClass(Sales);
