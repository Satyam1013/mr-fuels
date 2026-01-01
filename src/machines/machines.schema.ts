import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Machine extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop() machineNo!: string;
  @Prop() nozzleNo!: string;
  @Prop() fuelType!: string;
  @Prop({ default: true }) isActive!: boolean;
}

export const MachineSchema = SchemaFactory.createForClass(Machine);
