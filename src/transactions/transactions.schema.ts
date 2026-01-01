import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class UpiApp {
  @Prop() name!: string;
  @Prop() merchantId!: string;
}

@Schema({ timestamps: true })
export class TransactionDetails extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ type: [UpiApp], default: [] })
  upiApps!: UpiApp[];

  @Prop() swipeSettlement!: string;
  @Prop() swipeStatement!: string;
  @Prop() bankDeposit!: string;
}

export const TransactionDetailsSchema =
  SchemaFactory.createForClass(TransactionDetails);
