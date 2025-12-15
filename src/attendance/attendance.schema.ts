import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Attendance {
  @Prop({ type: Types.ObjectId, required: true, ref: "Admin" })
  pumpId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  role!: "manager" | "staff";

  @Prop({ required: true })
  date!: string; // YYYY-MM-DD

  @Prop({ required: true })
  status!: string; // "P", "A", "H", "L" etc
}

export type AttendanceDocument = Attendance & Document;
export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
