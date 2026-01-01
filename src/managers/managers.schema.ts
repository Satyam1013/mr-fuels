import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Manager extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  managerName!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop()
  managerAadhar!: any;

  @Prop({ required: true })
  shift!: number;

  @Prop({ required: true })
  salary!: string;

  @Prop({ required: true })
  password!: string;
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);
