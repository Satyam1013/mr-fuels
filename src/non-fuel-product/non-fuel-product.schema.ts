import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
export class NonFuelProduct {
  @Prop({ required: true })
  productName!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  totalStock!: number;

  @Prop({ required: true })
  unitType!: string;
}

export const NonFuelProductSchema =
  SchemaFactory.createForClass(NonFuelProduct);

@Schema({ timestamps: true })
export class NonFuelProducts extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  adminId!: Types.ObjectId;

  @Prop({ type: [NonFuelProductSchema], default: [] })
  nonFuelProducts!: NonFuelProduct[];
}

export const NonFuelProductsSchema =
  SchemaFactory.createForClass(NonFuelProducts);
