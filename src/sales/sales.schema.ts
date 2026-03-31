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

  // Dashboard data snapshot
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

  @Prop({ enum: ShiftStatusEnum, default: ShiftStatusEnum.PENDING })
  shiftStatus!: ShiftStatusEnum;
}

export const SalesSchema = SchemaFactory.createForClass(Sales);
