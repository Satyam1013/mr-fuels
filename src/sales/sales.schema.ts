import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ShiftStatusEnum } from "../shift-status/shift-status.enum";

@Schema({ _id: false })
class NozzleSale {
  @Prop({ default: 0 }) liters!: number;
  @Prop({ default: 0 }) amount!: number;
}

@Schema({ _id: false })
class SalesNozzle {
  @Prop({ required: true }) nozzleNumber!: number;
  @Prop() fuelType!: string;
  @Prop({ type: Types.ObjectId, ref: "Staff" }) staffId?: Types.ObjectId;
  @Prop({ default: 0 }) lastReading!: number;
  @Prop({ default: 0 }) currentReading!: number;
  @Prop({ type: NozzleSale }) sales!: NozzleSale;
  @Prop({ type: NozzleSale }) netSales!: NozzleSale;
  @Prop({ type: NozzleSale }) testing!: NozzleSale;
  @Prop({ default: false }) faultTesting!: boolean;

  @Prop({ type: String, default: null })
  faultDesc?: string | null;

  @Prop({ type: String, default: null })
  faultImg?: string | null;
}

@Schema({ _id: false })
class MachineSpecific {
  @Prop({ type: Types.ObjectId, ref: "Machine", required: true })
  machineId!: Types.ObjectId;

  @Prop({ required: true })
  machineName!: string;

  @Prop({ default: 0 })
  cashCollected!: number;
}

@Schema({ _id: false })
class MachinesData {
  @Prop({ type: [SalesNozzle], default: [] })
  nozzles!: SalesNozzle[];

  @Prop({ type: [MachineSpecific], default: [] })
  machineSpecific!: MachineSpecific[];
}

@Schema({ _id: false })
class StaffTransactions {
  @Prop({ default: 0 }) upi!: number;
  @Prop({ default: 0 }) pos!: number;
}

@Schema({ _id: false })
class StaffSaleAmount {
  @Prop({ default: 0 }) liters!: number;
  @Prop({ default: 0 }) amount!: number;
}

@Schema({ _id: false })
class SalesStaff {
  @Prop({ type: Types.ObjectId, ref: "Staff", required: true })
  staffId!: Types.ObjectId;

  @Prop({ required: true })
  staffName!: string;

  @Prop({ type: Types.ObjectId, ref: "Machine" })
  machineId!: Types.ObjectId;

  @Prop({ type: [Number], default: [] })
  assignedNozzleNumbers!: number[];

  @Prop()
  fuelType?: string;

  @Prop({ type: StaffSaleAmount })
  sales!: StaffSaleAmount;

  @Prop({ type: StaffSaleAmount })
  netSales!: StaffSaleAmount;

  @Prop({ type: StaffSaleAmount })
  testing!: StaffSaleAmount;

  @Prop({ default: 0 }) creditors!: number;
  @Prop({ default: 0 }) prepaid!: number;
  @Prop({ default: 0 }) lubricantSales!: number;

  @Prop({ type: StaffTransactions })
  transactions!: StaffTransactions;

  @Prop({ default: 0 }) pumpExpenses!: number;
  @Prop({ default: 0 }) personalExpenses!: number;
  @Prop({ default: 0 }) cashCollected?: number;
}

@Schema({ timestamps: true })
export class Sales extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true }) shiftNumber!: number;
  @Prop({ required: true }) date!: string;

  @Prop({ type: Object }) overallSales!: { liters: number; amount: number };
  @Prop({ type: Object }) netSales!: { liters: number; amount: number };
  @Prop({ type: Object }) testing!: { liters: number; amount: number };

  @Prop() overallCreditorsAmount!: number;
  @Prop() prepaid!: number;
  @Prop() pumpExpenses!: number;
  @Prop() personalExpenses!: number;
  @Prop() lubricantSales!: number;

  @Prop({ type: Object }) transactions!: { upi: number; pos: number };

  @Prop({ type: MachinesData })
  machines!: MachinesData;

  @Prop({ type: [SalesStaff], default: [] })
  staff!: SalesStaff[];

  @Prop({ enum: ShiftStatusEnum, default: ShiftStatusEnum.PENDING })
  shiftStatus!: ShiftStatusEnum;

  // ── Return Credit ──
  @Prop({ type: Object, default: { upi: 0, cash: 0, accountPay: 0 } })
  returnCreditTotals!: { upi: number; cash: number; accountPay: number };

  @Prop({ default: 0 }) returnCreditUpi!: number;
  @Prop({ default: 0 }) returnCreditCash!: number;
  @Prop({ default: 0 }) returnCreditAccountPay!: number;

  // ── Deposit ──
  @Prop({ default: 0 }) remainingDepositedAmount!: number;
  @Prop({ default: 0 }) depositAmount!: number;
  @Prop({ default: 0 }) additionalDepositAmount!: number;
  @Prop({ default: 0 }) moneyDeposited!: number;

  // ── Cash Summary ──
  @Prop({ default: 0 }) inHandCash!: number;
  @Prop({ default: 0 }) overallAmountGeneratedByPump!: number;
  @Prop({ default: 0 }) amountReceivedToPump!: number;

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
