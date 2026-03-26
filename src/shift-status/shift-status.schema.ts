import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { PumpStatusEnum, ShiftStatusEnum } from "./shift-status.enum";
import { Role } from "../admin/admin.enum";

@Schema({ _id: false })
export class Shift {
  @Prop({ required: true })
  shiftNumber!: number;

  @Prop()
  name!: string;

  @Prop()
  startTime?: string;

  @Prop()
  endTime?: string;

  @Prop({ enum: ShiftStatusEnum, default: ShiftStatusEnum.PENDING })
  status!: ShiftStatusEnum;

  @Prop({ type: Types.ObjectId, refPath: "closedByModel" })
  closedBy?: Types.ObjectId;

  @Prop({ enum: [Role.ADMIN, Role.MANAGER] })
  closedByModel?: Role;
}

@Schema({ timestamps: true })
export class ShiftStatus extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  date!: string;

  @Prop({ required: true })
  totalShifts!: number;

  @Prop({ type: Shift })
  currentShift!: Shift;

  @Prop({ type: [Shift] })
  shifts!: Shift[];

  @Prop({ default: false })
  dailyClose!: boolean;

  @Prop({ enum: PumpStatusEnum, default: PumpStatusEnum.OPEN })
  pumpStatus?: PumpStatusEnum;
}

export const ShiftStatusSchema = SchemaFactory.createForClass(ShiftStatus);

ShiftStatusSchema.index({ adminId: 1, date: 1 }, { unique: true });
