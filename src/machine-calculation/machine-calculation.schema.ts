import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class NozzleCalculation {
  @Prop({ required: true })
  nozzleName!: string;

  @Prop({ required: true })
  nozzleNumber!: number;

  @Prop({ type: Types.ObjectId, ref: "FuelProductDetails", required: true })
  fuelProductId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Staff" })
  staffId!: Types.ObjectId;

  @Prop()
  lastReading!: number;

  @Prop()
  currentReading!: number;

  @Prop()
  testingLiters!: number;

  @Prop()
  faultTestingLiters!: number;

  @Prop()
  upiAmount!: number;

  @Prop()
  posAmount!: number;
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
