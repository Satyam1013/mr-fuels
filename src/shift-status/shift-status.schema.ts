import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ClosedBy, PumpStatusEnum, ShiftStatusEnum } from "./shift-status.enum";

@Schema({ _id: false })
class Shift {
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

  @Prop({ enum: ClosedBy })
  closedBy?: ClosedBy;
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
