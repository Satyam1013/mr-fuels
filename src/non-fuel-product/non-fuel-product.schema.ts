import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class NonFuelProducts extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  productName!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  totalStock!: number;

  @Prop({ required: true })
  unitType!: string;
}

export const NonFuelProductsSchema =
  SchemaFactory.createForClass(NonFuelProducts);
