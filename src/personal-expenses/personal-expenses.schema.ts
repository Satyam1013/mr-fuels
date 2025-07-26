import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PersonalExpenseDocument = PersonalExpense & Document;

@Schema({ timestamps: true })
export class PersonalExpense {}

export const PersonalExpenseSchema =
  SchemaFactory.createForClass(PersonalExpense);
