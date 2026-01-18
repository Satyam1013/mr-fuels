import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class TimeRange {
  @Prop({ required: true }) start!: string;
  @Prop({ required: true }) end!: string;
}

@Schema({ timestamps: true })
export class PumpTiming extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: "Admin",
    required: true,
    index: true,
    unique: true,
  })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  dailyCloseReportTime!: string;

  @Prop({ default: false })
  is24Hour!: boolean;

  @Prop({ required: true })
  pumpHours!: number;

  @Prop({ type: TimeRange, required: true })
  pumpTime!: TimeRange;
}

export const PumpTimingSchema = SchemaFactory.createForClass(PumpTiming);
