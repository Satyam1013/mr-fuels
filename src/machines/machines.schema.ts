import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class Nozzle {
  @Prop({ required: true })
  fuelType!: string;

  @Prop({ required: true })
  price!: string;

  @Prop({ default: true })
  isActive!: boolean;
}

@Schema({ timestamps: true })
export class Machine extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  machineNumber!: string;

  @Prop({ required: true })
  machineKey!: string;

  @Prop({ required: true })
  nozzleCount!: number;

  @Prop({ type: [Nozzle], default: [] })
  nozzle!: Nozzle[];

  @Prop({ default: true })
  isActive!: boolean;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
