import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { FuelType } from "./machine-calculation.enum";

@Schema({ _id: false })
class NozzleCalculation {
  @Prop({ required: true })
  nozzleName!: string;

  @Prop({ required: true })
  nozzleNo!: number;

  @Prop()
  fuelType!: FuelType;

  @Prop()
  lastReading!: number;

  @Prop()
  currentReading!: number;

  @Prop()
  testingLiters!: number;

  @Prop()
  faultTestingLiters!: number;

  @Prop()
  pricePerLiter!: number;

  @Prop()
  salesLiters!: number;

  @Prop()
  upiAmount!: number;

  @Prop()
  posAmount!: number;

  @Prop({ type: Types.ObjectId, ref: "Staff" })
  staffId!: Types.ObjectId;
}

@Schema({ timestamps: true })
export class MachineCalculation extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  adminId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Machine", required: true })
  machineId!: Types.ObjectId;

  @Prop({ required: true })
  date!: Date;

  @Prop({ required: true })
  shiftNumber!: number;

  @Prop({ type: [NozzleCalculation], default: [] })
  nozzles!: NozzleCalculation[];
}

export const MachineCalculationSchema =
  SchemaFactory.createForClass(MachineCalculation);
