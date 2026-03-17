import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { Subscription } from "../subscription/subscription.schema";
import { Role } from "./admin.enum";

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

  @Prop({ default: Role.ADMIN })
  role!: Role;

  @Prop({ default: false })
  setupComplete!: boolean;

  @Prop({ type: Types.ObjectId, ref: "Subscription", default: null })
  currentSubscriptionId?: Types.ObjectId | Subscription;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
