import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { CreditBy, CreditStatusEnum } from "./creditors.enum";

@Schema({ timestamps: true })
export class Creditor extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Machine", required: true, index: true })
  machineId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Customer", required: true })
  customerId!: Types.ObjectId;

  @Prop()
  creditDate?: Date;

  @Prop()
  returnDate?: Date;

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

  @Prop({ required: true })
  nozzleNumber!: number;

  @Prop({
    enum: CreditStatusEnum,
    default: CreditStatusEnum.TAKEN,
    required: true,
  })
  creditStatus!: CreditStatusEnum;
}

export const CreditorSchema = SchemaFactory.createForClass(Creditor);
