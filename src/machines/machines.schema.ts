import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
class Nozzle {
  @Prop({ required: true })
  nozzleNumber!: number;

  @Prop({ type: Types.ObjectId, ref: "FuelProductDetail", required: true })
  fuelProductId!: Types.ObjectId;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop({ type: Types.ObjectId, ref: "Tank", required: true, index: true })
  tankId!: Types.ObjectId;
}

@Schema({ timestamps: true })
export class Machine extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  machineNumber!: string;

  @Prop({ required: true })
  machineName!: string;

  @Prop({ required: true })
  nozzleCount!: number;

  @Prop({ type: [Nozzle], default: [] })
  nozzle!: Nozzle[];

  @Prop({ default: true })
  isActive!: boolean;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
