import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { FuelType } from "../common/enums/fuel-type.enum";

@Schema({ _id: false })
export class FuelProductDetail {
  @Prop({ enum: FuelType, required: true })
  fuelType!: FuelType;

  @Prop({ required: true })
  price!: number;

  @Prop()
  oldPrice?: number;

  @Prop({ required: true })
  purchasingPrice!: number;

  @Prop({ required: true })
  updatedPriceFrom!: Date;
}

@Schema({ timestamps: true })
export class FuelProductDetails extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: "Admin",
    required: true,
    unique: true,
    index: true,
  })
  adminId!: Types.ObjectId;

  @Prop({ type: [FuelProductDetail], default: [] })
  products!: FuelProductDetail[];
}

export const FuelProductDetailsSchema =
  SchemaFactory.createForClass(FuelProductDetails);
