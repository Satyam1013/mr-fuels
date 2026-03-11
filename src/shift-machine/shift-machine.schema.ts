import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class NozzleReading {
  @Prop({ required: true })
  nozzleName!: string;

  @Prop({ required: true })
  fuelType!: string;

  @Prop({ required: true })
  lastReading!: number;

  @Prop({ required: true })
  currentReading!: number;

  @Prop({ required: true })
  pricePerLiter!: number;

  @Prop({ default: 0 })
  testingLiters!: number;

  @Prop({ default: 0 })
  faultTestingLiters!: number;

  @Prop()
  narration?: string;

  @Prop()
  totalSellLiters?: number;

  @Prop()
  totalAmount?: number;

  @Prop()
  readingPhotoUrl?: string;

  @Prop()
  testingPhotoUrl?: string;

  @Prop()
  faultPhotoUrl?: string;
}

@Schema({ timestamps: true })
export class ShiftMachineEntry extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true })
  shiftId!: number;

  @Prop({ required: true })
  shiftNumber!: number;

  @Prop({ type: Types.ObjectId, ref: "Machine", required: true })
  machineId!: Types.ObjectId;

  @Prop({ type: [NozzleReading], default: [] })
  nozzles!: NozzleReading[];

  @Prop()
  totalMachineAmount?: number;
}

export const ShiftMachineSchema =
  SchemaFactory.createForClass(ShiftMachineEntry);

ShiftMachineSchema.index(
  { adminId: 1, date: 1, shiftId: 1, machineId: 1 },
  { unique: true },
);
