import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { CreditBy } from "../creditors/creditors.enum";

@Schema({ timestamps: true })
export class PumpExpense extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Machine", required: true })
  machineId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true })
  shiftNumber!: number;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  category!: string;

  @Prop({ enum: CreditBy, required: true })
  creditBy!: CreditBy;

  @Prop()
  narration?: string;

  @Prop()
  photoUrl?: string;

  @Prop({ required: true })
  nozzleNumber!: number;
}

export const PumpExpenseSchema = SchemaFactory.createForClass(PumpExpense);
