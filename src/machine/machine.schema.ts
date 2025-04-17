import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MachineDocument = Machine & Document;

export enum FuelType {
  PETROL = "Petrol",
  DIESEL = "Diesel",
  POWER = "Power",
}

@Schema({ timestamps: true })
export class Machine {
  @Prop({ required: true })
  machineNo: string;

  @Prop({ required: true })
  nozzleNo: string;

  @Prop({ required: true, enum: FuelType })
  fuelType: FuelType;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: [
      {
        date: { type: Date, required: true },
        reading: { type: Number, required: true },
      },
    ],
    default: [],
  })
  readings: { date: Date; reading: number }[];
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
