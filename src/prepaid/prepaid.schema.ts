import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { CreditBy } from "../creditors/creditors.enum";

@Schema({ timestamps: true })
export class Prepaid extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Customer", required: true })
  customerId!: Types.ObjectId;

  @Prop({ required: true })
  partyName!: string;

  @Prop({ required: true })
  phoneNumber!: string;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true })
  shiftNumber!: number;

  @Prop({ enum: CreditBy, required: true })
  creditBy!: CreditBy;

  @Prop()
  narration?: string;

  @Prop()
  photoUrl?: string;

  @Prop({ type: Types.ObjectId, ref: "Machine", required: true, index: true })
  machineId!: Types.ObjectId;

  @Prop({ required: true })
  nozzleNumber!: number;
}

export const PrepaidSchema = SchemaFactory.createForClass(Prepaid);
