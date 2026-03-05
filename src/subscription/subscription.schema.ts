import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { SubscriptionStatus } from "./subscription.enum";

@Schema({ timestamps: true })
export class Subscription extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  adminId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Plan", required: true })
  planId!: Types.ObjectId;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  expiryDate!: Date;

  @Prop({ enum: SubscriptionStatus, default: SubscriptionStatus.ACTIVE })
  status!: SubscriptionStatus;

  @Prop({ default: false })
  isTrial!: boolean;

  @Prop({ default: null })
  paymentId?: string; // future Stripe/Razorpay
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
