import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class UpiPayment extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true })
  shiftId!: number;

  @Prop([
    {
      appName: String,
      amount: Number,
      attachmentUrl: String,
    },
  ])
  upiPayments!: {
    appName: string;
    amount: number;
    attachmentUrl: string;
  }[];
}

export const UpiPaymentSchema = SchemaFactory.createForClass(UpiPayment);
