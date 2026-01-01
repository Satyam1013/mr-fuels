import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ required: true })
  businessName!: string;

  @Prop({ required: true })
  dealerCode!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true, unique: true })
  mobileNo!: string;

  @Prop({ required: true })
  password!: string;

  @Prop({ default: false })
  setupComplete!: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
