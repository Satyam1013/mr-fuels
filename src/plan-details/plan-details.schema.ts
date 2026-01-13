import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import {
  PlanName,
  PlanStatus,
  DurationType,
  Currency,
} from "./plan-details.enums";

export type PlanDocument = Plan & Document;

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, enum: PlanName })
  name!: PlanName;

  @Prop({ required: true })
  tier!: number;

  @Prop({ required: true })
  description!: string;

  @Prop({
    _id: false,
    type: {
      type: { type: String, enum: DurationType, required: true },
      months: { type: Number, required: true },
    },
  })
  duration!: {
    type: DurationType;
    months: number;
  };

  @Prop({
    _id: false,
    type: {
      originalPrice: { type: Number, required: true },
      finalPrice: { type: Number, required: true },
      currency: { type: String, enum: Currency, required: true },
      isFree: { type: Boolean, required: true },
    },
  })
  pricing!: {
    originalPrice: number;
    finalPrice: number;
    currency: Currency;
    isFree: boolean;
  };

  @Prop({
    _id: false,
    type: {
      enabled: { type: Boolean, required: true },
      trialDays: { type: Number },
    },
  })
  trial!: {
    enabled: boolean;
    trialDays?: number;
  };

  @Prop({ type: [String], default: [] })
  features!: string[];

  @Prop({
    _id: false,
    type: {
      mostPopular: Boolean,
      discounted: Boolean,
      freeTrial: Boolean,
    },
    default: {},
  })
  tags!: {
    mostPopular?: boolean;
    discounted?: boolean;
    freeTrial?: boolean;
  };

  @Prop({
    _id: false,
    type: {
      badgeText: String,
      badgeColor: String,
      gradient: [String],
    },
    default: {},
  })
  ui!: {
    badgeText?: string;
    badgeColor?: string;
    gradient?: string[];
  };

  @Prop({ enum: PlanStatus, default: PlanStatus.ACTIVE })
  status!: PlanStatus;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
