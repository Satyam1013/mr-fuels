// src/plan/plan.schema.ts

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true, unique: true })
  label: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  period: string;

  @Prop({ required: true, enum: ["free", "monthly", "quarterly", "yearly"] })
  type: "free" | "monthly" | "quarterly" | "yearly";

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export type PlanDocument = Plan & Document;
export const PlanSchema = SchemaFactory.createForClass(Plan);
