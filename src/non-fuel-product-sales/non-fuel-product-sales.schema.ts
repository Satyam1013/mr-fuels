import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { CreditBy } from "../creditors/creditors.enum";

@Schema({ timestamps: true })
export class NonFuelSaleProduct extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Machine", required: true })
  machineId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "NonFuelProducts", required: true })
  productId!: Types.ObjectId;

  @Prop({ required: true })
  quantity!: number;

  @Prop({ required: true })
  pricePerUnit!: number;

  @Prop({ required: true })
  amount!: number;

  @Prop({ enum: CreditBy, required: true })
  creditBy!: CreditBy;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true })
  shiftNumber!: number;

  @Prop()
  narration?: string;

  @Prop()
  photoUrl?: string;
}

export const NonFuelSaleProductSchema =
  SchemaFactory.createForClass(NonFuelSaleProduct);
