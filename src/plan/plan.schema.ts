import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { PlanEnum, PlanEnumType } from "../common/types";

@Schema({ timestamps: true })
export class Plan {
  @Prop({ required: true, unique: true })
  label!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  price!: string;

  @Prop({ required: true })
  period!: string;

  @Prop({ required: true, enum: Object.values(PlanEnum) })
  type!: PlanEnumType;

  @Prop({ type: Boolean, default: true })
  isActive!: boolean;
}

export type PlanDocument = Plan & Document;
export const PlanSchema = SchemaFactory.createForClass(Plan);
