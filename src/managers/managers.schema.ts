import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Role } from "../admin/admin.enum";

@Schema({ timestamps: true })
export class Manager extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  managerName!: string;

  @Prop({ required: true, unique: true })
  phone!: string;

  @Prop()
  managerAadhar?: string;

  @Prop()
  managerPan?: string;

  @Prop({ required: true })
  shift!: number;

  @Prop({ required: true })
  salary!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ enum: Role, default: Role.MANAGER })
  role!: Role;
}

export const ManagerSchema = SchemaFactory.createForClass(Manager);
