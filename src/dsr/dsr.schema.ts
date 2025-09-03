import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type DSRDocument = DSR & Document;

@Schema({ _id: false })
class FuelEntry {
  @Prop({ required: true })
  manualDip!: number;

  @Prop({ required: true })
  manualDipPic!: string;

  @Prop({ required: true })
  receipt!: number;

  @Prop({ required: true })
  receiptPic!: string;

  @Prop({ required: true })
  meterReading!: number;

  @Prop({ required: true })
  meterReadingPic!: string;

  @Prop({ required: true })
  pumpTesting!: number;

  @Prop({ required: true })
  pumpTestingPic!: string;
}

@Schema({ timestamps: true })
export class DSR {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  pumpId!: Types.ObjectId;

  @Prop({ type: FuelEntry })
  petrol!: FuelEntry;

  @Prop({ type: FuelEntry })
  diesel!: FuelEntry;

  @Prop({ type: FuelEntry })
  power!: FuelEntry;
}

export const DSRSchema = SchemaFactory.createForClass(DSR);
