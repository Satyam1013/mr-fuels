import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CreditorDocument = Creditor & Document;

@Schema({ timestamps: true })
export class Creditor {
  @Prop({
    type: Types.ObjectId,
    ref: "CreditorContact",
    required: true,
    unique: true,
  })
  creditorContactId!: Types.ObjectId;

  @Prop()
  totalCreditGiven!: number;

  @Prop()
  totalCreditLeft!: number;

  @Prop([
    {
      _id: false,
      amount: Number,
      time: Date,
      type: { type: String, enum: ["credit", "return"] },
      imgUrl: String,
      details: String,
      paidType: { type: String, enum: ["cash", "account"] },
    },
  ])
  records!: {
    amount: number;
    time: Date;
    type: "credit" | "return";
    imgUrl: string;
    details: string;
    paidType: "cash" | "account";
  }[];
}

export const CreditorSchema = SchemaFactory.createForClass(Creditor);
