import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { CreditBy } from "./creditors.enum";

@Schema({ timestamps: true })
export class Creditor extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  creditorName!: string;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true })
  shiftNumber!: number;

  @Prop({ required: true })
  amount!: number;

  @Prop({ enum: CreditBy, required: true })
  creditBy!: CreditBy;

  @Prop({ required: true })
  phoneNumber!: string;

  @Prop()
  narration?: string;

  @Prop()
  photoUrl?: string;

  @Prop({ type: Types.ObjectId, ref: "Machine", required: true, index: true })
  machineId!: Types.ObjectId;

  @Prop({ required: true })
  nozzleNumber!: number;
}

export const CreditorSchema = SchemaFactory.createForClass(Creditor);
