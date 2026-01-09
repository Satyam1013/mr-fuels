import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PlanDocument = Plan & Document;

@Schema()
export class Plan {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true, enum: ["pro", "premium"] })
  name!: "pro" | "premium";

  @Prop({ required: true })
  tier!: number;

  @Prop({ required: true })
  description!: string;

  @Prop({
    type: Object,
    required: true,
  })
  duration!: {
    type: "trial" | "monthly" | "yearly";
    months: number;
  };

  @Prop({
    type: Object,
    required: true,
  })
  pricing!: {
    originalPrice: number;
    finalPrice: number;
    currency: "INR";
    isFree: boolean;
  };

  @Prop({
    type: Object,
    required: true,
  })
  trial!: {
    enabled: boolean;
    trialDays?: number;
  };

  @Prop({ type: [String], default: [] })
  features!: string[];

  @Prop({
    type: Object,
    default: {},
  })
  tags!: {
    mostPopular?: boolean;
    discounted?: boolean;
    freeTrial?: boolean;
  };

  @Prop({
    type: Object,
    default: {},
  })
  ui!: {
    badgeText?: string;
    badgeColor?: string;
    gradient?: string[];
  };

  @Prop({ enum: ["active", "inactive"], default: "active" })
  status!: "active" | "inactive";

  @Prop({ default: Date.now })
  createdAt!: Date;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
