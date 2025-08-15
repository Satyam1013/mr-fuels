import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DSRDocument = DSR & Document;

@Schema({ timestamps: true })
export class DSR {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  pumpId!: Types.ObjectId;
}

export const DSRSchema = SchemaFactory.createForClass(DSR);
