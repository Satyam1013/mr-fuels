import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({ timestamps: true })
export class Sales extends Document {
  @Prop({ type: Types.ObjectId, ref: "Admin", required: true, index: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  shift!: number;

  @Prop({
    enum: ["open", "closed"],
    default: "open",
  })
  shiftStatus!: string;

  @Prop({ required: true })
  date!: Date;
}

export const SalesSchema = SchemaFactory.createForClass(Sales);
