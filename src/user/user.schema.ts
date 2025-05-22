import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

export enum UserRole {
  MANAGER = "MANAGER",
  STAFF = "STAFF",
}

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  managerName: string;

  @Prop({ required: true })
  managerPassword: string;

  @Prop({ required: true })
  managerMobile: string;

  @Prop({ required: true })
  shift: string;

  @Prop({ default: UserRole.MANAGER })
  role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
