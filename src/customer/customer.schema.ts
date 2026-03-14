import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  phoneNumber!: string;

  @Prop()
  vehicleNumber?: string;

  @Prop()
  address?: string;

  @Prop({ default: 0 })
  creditBalance!: number;

  @Prop({ default: 0 })
  prepaidBalance!: number;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index({ adminId: 1, phoneNumber: 1 }, { unique: true });
