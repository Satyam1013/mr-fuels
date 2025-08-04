import { Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DSRDocument = DSR & Document;

@Schema({ timestamps: true })
export class DSR {}

export const DSRSchema = SchemaFactory.createForClass(DSR);
