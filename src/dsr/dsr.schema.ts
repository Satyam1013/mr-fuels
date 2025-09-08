import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DSRDocument = DSR & Document;

@Schema({ timestamps: true })
export class DSR {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  pumpId!: Types.ObjectId;

  @Prop({ type: Date, required: true })
  date!: Date;

  @Prop({ type: Object, required: true })
  manualDip!: Record<string, number>;

  @Prop({ type: Object, required: true })
  receipt!: Record<string, number>;

  @Prop({ type: Object, required: true })
  pumpTesting!: Record<string, number>;

  @Prop({ type: Object, required: true })
  meterReading!: Record<string, Record<string, number>>;
}

export const DSRSchema = SchemaFactory.createForClass(DSR);
