import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ _id: false })
class NozzleAllotment {
  @Prop({ required: true })
  nozzleId!: string;

  @Prop({ type: Types.ObjectId, ref: "Staff", required: true })
  staffId!: Types.ObjectId;

  @Prop({ enum: ["Active", "Inactive"], default: "Active" })
  nozzleStatus!: string;

  @Prop({ type: String, default: null })
  inactiveStatus!: string | null;
}

const NozzleAllotmentSchema = SchemaFactory.createForClass(NozzleAllotment);

@Schema({ _id: false })
class MachineAllotment {
  @Prop({ required: true })
  machineId!: string;

  @Prop({ type: [NozzleAllotmentSchema], default: [] })
  nozzles!: NozzleAllotment[];
}

const MachineAllotmentSchema = SchemaFactory.createForClass(MachineAllotment);

@Schema({ timestamps: true })
export class ShiftAllotment extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  shiftId!: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: "Manager" }], default: [] })
  managers!: Types.ObjectId[];

  @Prop({ type: [MachineAllotmentSchema], default: [] })
  machines!: MachineAllotment[];
}

export const ShiftAllotmentSchema =
  SchemaFactory.createForClass(ShiftAllotment);

ShiftAllotmentSchema.index({ adminId: 1, shiftId: 1 }, { unique: true });
