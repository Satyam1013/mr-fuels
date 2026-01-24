import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class NonFuelProduct extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  productName!: string;

  @Prop({ required: true })
  price!: string;

  @Prop({ required: true })
  totalStock!: string;

  @Prop({ required: true })
  unitType!: string;
}

export const NonFuelProductSchema =
  SchemaFactory.createForClass(NonFuelProduct);
