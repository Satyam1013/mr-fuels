import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FuelPriceDocument = FuelPrice & Document;

@Schema({ timestamps: true })
export class FuelPrice {
  @Prop({ required: true })
  petrol: number;

  @Prop({ required: true })
  diesel: number;

  @Prop({ required: true })
  power: number;
}

export const FuelPriceSchema = SchemaFactory.createForClass(FuelPrice);
