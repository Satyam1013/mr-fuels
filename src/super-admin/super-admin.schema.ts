import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class SuperAdmin {
  @Prop({ type: Types.ObjectId, auto: true }) _id: Types.ObjectId;

  @Prop({ required: true }) name: string;

  @Prop({ required: true }) email: string;

  @Prop({ required: true }) mobile: string;

  @Prop({ required: true }) password: string;
}

export type SuperAdminDocument = SuperAdmin & Document;
export const SuperAdminSchema = SchemaFactory.createForClass(SuperAdmin);
