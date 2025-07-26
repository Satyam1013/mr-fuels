import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CreditorDocument = Creditor & Document;

@Schema({ timestamps: true })
export class Creditor {
  @Prop({ required: true }) date!: Date;

  @Prop({ required: true })
  totalCreditGiven!: number;

  @Prop({ required: true })
  totalCreditLeft!: number;

  @Prop([
    {
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
