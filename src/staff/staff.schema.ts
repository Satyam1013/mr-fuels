import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Staff extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  staffName!: string;

  @Prop({ required: true })
  staffNumber!: string;

  @Prop({ required: true })
  shift!: number;

  @Prop({ required: true })
  salary!: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
