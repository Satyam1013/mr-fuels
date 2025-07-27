import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CreditorContactDocument = CreditorContact & Document;

@Schema({ timestamps: true })
export class CreditorContact {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, unique: true })
  number!: string;
}

export const CreditorContactSchema =
  SchemaFactory.createForClass(CreditorContact);
