// src/pump-expense/pump-expense.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type PumpExpenseDocument = PumpExpense & Document;

@Schema({ _id: false })
class Entry {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) amount!: number;
  @Prop({ required: true }) time!: Date;
  @Prop({ required: true }) category!: string;
  @Prop({ required: true }) paymentMode!: string;
}

const EntrySchema = SchemaFactory.createForClass(Entry);

@Schema({ timestamps: true })
export class PumpExpense {
  @Prop({ required: true }) date!: Date;

  @Prop({ type: [EntrySchema], required: true, default: [] })
  entries!: Entry[];
}

export const PumpExpenseSchema = SchemaFactory.createForClass(PumpExpense);
