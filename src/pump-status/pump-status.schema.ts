// pump-status.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types, Document } from "mongoose";

export type PumpStatusDocument = PumpStatus & Document;

@Schema({ timestamps: true })
export class PumpStatus {
  @Prop({ required: true })
  machineNo!: number;

  @Prop({ required: true })
  nozzleNumber!: string;

  @Prop({ required: true })
  fuelType!: string;

  @Prop({
    enum: ["active", "inactive", "maintenance"],
    default: "active",
  })
  status!: string;

  @Prop({ type: Types.ObjectId, ref: "Staff", required: true })
  handledBy!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  adminId!: Types.ObjectId;
}

export const PumpStatusSchema = SchemaFactory.createForClass(PumpStatus);
