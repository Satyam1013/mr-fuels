import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

class Denomination {
  @Prop({ required: true })
  denomination!: number;

  @Prop({ required: true })
  count!: number;

  @Prop({ required: true })
  amount!: number;
}

@Schema({ timestamps: true })
export class CashCollection extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Machine", required: true })
  machineId!: Types.ObjectId;

  @Prop({ required: true })
  nozzleNumber!: number;

  @Prop({ required: true })
  shiftNumber!: number;

  @Prop({ required: true })
  date!: Date;

  @Prop({ type: [Denomination], required: true })
  denominations!: Denomination[];

  @Prop({ required: true })
  totalAmount!: number;
}

export const CashCollectionSchema =
  SchemaFactory.createForClass(CashCollection);
