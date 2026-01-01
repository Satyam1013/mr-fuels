import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Manager extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop() managerName!: string;
  @Prop() phone!: string;
  @Prop() shift!: number;
  @Prop() salary!: string;
  @Prop() password!: string; // hashed
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);
