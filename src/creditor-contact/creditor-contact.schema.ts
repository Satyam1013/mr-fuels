import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CreditorContactDocument = CreditorContact & Document;

@Schema({ timestamps: true })
export class CreditorContact {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  number!: string;

  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  pumpId!: Types.ObjectId;
}

export const CreditorContactSchema =
  SchemaFactory.createForClass(CreditorContact);
