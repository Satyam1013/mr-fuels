import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class PumpExpense extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

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

  @Prop({ type: Types.ObjectId, required: true })
  creditBy!: Types.ObjectId;

  @Prop()
  narration?: string;

  @Prop()
  photoUrl?: string;
}

export const PumpExpenseSchema = SchemaFactory.createForClass(PumpExpense);
