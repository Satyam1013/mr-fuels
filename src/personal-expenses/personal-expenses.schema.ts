import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PersonalExpenseDocument = PersonalExpense & Document;

@Schema({ timestamps: true })
export class PersonalExpense {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  pumpId!: Types.ObjectId;
}

export const PersonalExpenseSchema =
  SchemaFactory.createForClass(PersonalExpense);
