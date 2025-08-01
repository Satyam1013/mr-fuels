import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type PersonalExpenseDocument = PersonalExpense & Document;

@Schema({ _id: false })
class Entry {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) amount!: number;
  @Prop({ required: true }) time!: Date;
  @Prop({ required: true }) category!: string;
  @Prop({ required: true }) paymentMode!: string;
  @Prop() imageUrl!: string;
}

const EntrySchema = SchemaFactory.createForClass(Entry);

@Schema({ timestamps: true })
export class PersonalExpense {
  @Prop({ required: true }) date!: Date;

  @Prop({ type: Types.ObjectId, ref: "Admin", required: true })
  pumpId!: Types.ObjectId;

  @Prop({ type: [EntrySchema], required: true, default: [] })
  entries!: Entry[];
}

export const PersonalExpenseSchema =
  SchemaFactory.createForClass(PersonalExpense);
