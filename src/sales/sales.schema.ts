import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ShiftStatus } from "./sales.enum";

@Schema({ timestamps: true })
export class Sales extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  shift!: number;

  @Prop({
    enum: ShiftStatus,
    default: ShiftStatus.OPEN,
  })
  shiftStatus!: ShiftStatus;

  @Prop({ required: true })
  date!: Date;
}

export const SalesSchema = SchemaFactory.createForClass(Sales);
