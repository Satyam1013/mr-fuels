import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { FuelType } from "../common/enums/fuel-type.enum";
import { PrepaidModeEnum, PrepaidProductTypeEnum } from "./prepaid.enum";

@Schema({ timestamps: true })
export class Prepaid extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Customer", required: true })
  customerId!: Types.ObjectId;

  @Prop({ required: true })
  amount!: number;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true })
  shiftNumber!: number;

  @Prop({ type: Types.ObjectId, required: true })
  creditBy!: Types.ObjectId;

  // ── Mode ──
  @Prop({ enum: PrepaidModeEnum, required: true })
  mode!: PrepaidModeEnum;

  // ── Transit fields (sirf mode === "transit" pe) ──
  @Prop({ enum: PrepaidProductTypeEnum, default: null })
  productType?: PrepaidProductTypeEnum;

  // Agar productType === "fuelType"
  @Prop({ enum: FuelType, default: null })
  fuelType?: FuelType;

  // Agar productType === "nonFuelType"
  @Prop({ type: Types.ObjectId, ref: "NonFuelProducts", default: null })
  nonFuelProductId?: Types.ObjectId;

  @Prop({ default: null })
  quantity?: number;

  @Prop()
  narration?: string;

  @Prop()
  photoUrl?: string;
}

export const PrepaidSchema = SchemaFactory.createForClass(Prepaid);
