import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Staff extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop() staffName!: string;
  @Prop() staffNumber!: string;
  @Prop() shift!: number;
  @Prop() salary!: string;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
