import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class UpiPayment {
  @Prop({ required: true })
  appName!: string;

  @Prop({ required: true })
  amount!: number;

  @Prop()
  attachmentName?: string;

  @Prop()
  attachmentUri?: string;
}

@Schema({ _id: false })
class PosPayment {
  @Prop({ required: true })
  machineName!: string;

  @Prop({ required: true })
  amount!: number;

  @Prop()
  attachmentName?: string;

  @Prop()
  attachmentUri?: string;
}

@Schema({ timestamps: true })
export class DigitalPayment extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true })
  shiftId!: number;

  @Prop()
  shiftName!: string;

  @Prop()
  shiftNumber!: number;

  @Prop({ type: [UpiPayment], default: [] })
  upiPayments!: UpiPayment[];

  @Prop({ type: [PosPayment], default: [] })
  posPayments!: PosPayment[];
}

export const DigitalPaymentSchema =
  SchemaFactory.createForClass(DigitalPayment);
