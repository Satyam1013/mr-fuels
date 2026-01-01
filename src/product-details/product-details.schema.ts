import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class ProductDetails extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  selectedProducts!: string[];
}

export const ProductDetailsSchema =
  SchemaFactory.createForClass(ProductDetails);
