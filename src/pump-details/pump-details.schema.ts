import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class PumpTime {
  @Prop({ required: true })
  start!: string;

  @Prop({ required: true })
  end!: string;
}

@Schema({ timestamps: true })
export class PumpDetails extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  fuelPartner!: string;

  @Prop({ default: false })
  is24Hour!: boolean;

  @Prop({ required: true })
  numberOfShifts!: number;

  @Prop({ type: Types.ObjectId, ref: "TankDetails" })
  tank!: Types.ObjectId;

  @Prop({ type: PumpTime, required: true })
  pumpTime!: PumpTime;

  @Prop({ required: true })
  pumpHours!: number;

  @Prop({ required: true })
  dailyCloseReportTime!: string;
}

export const PumpDetailsSchema = SchemaFactory.createForClass(PumpDetails);
